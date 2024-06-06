using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

var clientUrl = builder.Configuration.GetValue<string>("CLIENT_URL");
if (string.IsNullOrEmpty(clientUrl))
{
    throw new ArgumentNullException(nameof(clientUrl));
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(clientUrl);
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowCredentials();
        });
});

// Setup the Db
var dbConfig = builder.Configuration.GetValue<string>("CONNECTION_STRING_USERS");
if (string.IsNullOrEmpty(dbConfig))
{
    throw new ArgumentNullException(nameof(dbConfig));
}

builder.Services.AddDbContext<UserDataContext>(
    o => o.UseNpgsql(dbConfig));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<ApplicationUser>(opt =>
{
    opt.Password.RequiredLength = 8;
    opt.User.RequireUniqueEmail = true;
    opt.Password.RequireNonAlphanumeric = false;
    opt.SignIn.RequireConfirmedEmail = true;
})
    .AddEntityFrameworkStores<UserDataContext>();

builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.AddOptions<BearerTokenOptions>(IdentityConstants.BearerScheme).Configure(options =>
{
    // TODO: Remove as this is only for testing
    options.BearerTokenExpiration = TimeSpan.FromSeconds(10);
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHttpClient();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Create routes for the identity endpoints
app.MapIdentityApi<ApplicationUser>();

// Activate the CORS policy
app.UseCors(MyAllowSpecificOrigins);

// Enable authentication and authorization after CORS Middleware
// processing (UseCors) in case the Authorization Middleware tries
// to initiate a challenge before the CORS Middleware has a chance
// to set the appropriate headers.
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/logout", async (SignInManager<ApplicationUser> signInManager,
    [FromBody] object empty) =>
{
    if (empty != null)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }
    return Results.Unauthorized();
}).RequireAuthorization(); // So that only authorized users can use this endpoint

app.MapControllers();

app.Run();