using FirebaseAdmin;
using FirebaseAdminAuthentication.DependencyInjection.Extensions;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using MoneyMinder.Data;

var builder = WebApplication.CreateBuilder(args);

// Set the environment variable using the project secrets
if (builder.Environment.IsDevelopment())
{
    var firebaseConfigSecret = builder.Configuration.GetValue<string>("FIREBASE_CONFIG");
    Environment.SetEnvironmentVariable("FIREBASE_CONFIG", firebaseConfigSecret);

    var dbConnectionString = builder.Configuration.GetValue<string>("CONNECTION_STRING_USERS");
    Environment.SetEnvironmentVariable("CONNECTION_STRING_USERS", dbConnectionString);
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

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();