using FirebaseAdmin;
using FirebaseAdminAuthentication.DependencyInjection.Extensions;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using MoneyMinder.Data;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Set the environment variable using the project secrets
if (builder.Environment.IsDevelopment())
{
    var firebaseConfigSecret = builder.Configuration.GetValue<string>("FIREBASE_CONFIG");
    Environment.SetEnvironmentVariable("FIREBASE_CONFIG", firebaseConfigSecret);

    var dbConfigSecret = builder.Configuration.GetValue<string>("CONNECTION_STRING_USERS");
    Environment.SetEnvironmentVariable("CONNECTION_STRING_USERS", dbConfigSecret);

    var clientUrlSecret = builder.Configuration.GetValue<string>("CLIENT_URL");
    Environment.SetEnvironmentVariable("CLIENT_URL", clientUrlSecret);

}

// Add services to the container.
var firebaseConfig = Environment.GetEnvironmentVariable("FIREBASE_CONFIG");
if (firebaseConfig == null)
{
    throw new ArgumentNullException(nameof(firebaseConfig));
}

var dbConfig = Environment.GetEnvironmentVariable("CONNECTION_STRING_USERS");
builder.Services.AddDbContext<UserDataContext>(
    o => o.UseNpgsql(dbConfig));

builder.Services.AddSingleton(FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromJson(firebaseConfig)
}));
builder.Services.AddFirebaseAuthentication();
builder.Services.AddAuthorization();

var clientUrl = Environment.GetEnvironmentVariable("CLIENT_URL");
if (string.IsNullOrEmpty(clientUrl)) throw new Exception("Client URL environment variable not found");
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            // TODO: Audit this
            policy.WithOrigins(clientUrl);
            policy.AllowAnyMethod();
            policy.AllowCredentials();
            policy.AllowAnyHeader();
        });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();