using FirebaseAdmin;
using FirebaseAdminAuthentication.DependencyInjection.Extensions;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using MoneyMinder.Database.Data;
using System.Text.Json.Serialization;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
var firebaseConfig = builder.Configuration.GetValue<string>("FIREBASE_CONFIG");
if (string.IsNullOrEmpty(firebaseConfig))
{
    throw new ArgumentNullException(nameof(firebaseConfig));
}

var dbConfig = builder.Configuration.GetValue<string>("CONNECTION_STRING_USERS");
if (string.IsNullOrEmpty(dbConfig))
{
    throw new ArgumentNullException(nameof(dbConfig));
}

builder.Services.AddDbContext<UserDataContext>(
    o => o.UseNpgsql(dbConfig));

builder.Services.AddSingleton(FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromJson(firebaseConfig)
}));
builder.Services.AddFirebaseAuthentication();
builder.Services.AddAuthorization();

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
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();