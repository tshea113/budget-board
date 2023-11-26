using FirebaseAdmin;
using FirebaseAdminAuthentication.DependencyInjection.Extensions;
using Google.Apis.Auth.OAuth2;

var builder = WebApplication.CreateBuilder(args);

// Set the environment variable using the project secrets
if (builder.Environment.IsDevelopment())
{
    var firebaseConfigSecret = builder.Configuration.GetValue<string>("GOOGLE_APPLICATION_CREDENTIALS");
    Environment.SetEnvironmentVariable("FIREBASE_CONFIG", firebaseConfigSecret);
}

// Add services to the container.

var firebaseConfig = Environment.GetEnvironmentVariable("FIREBASE_CONFIG");
if (firebaseConfig == null)
{
    throw new ArgumentNullException(nameof(firebaseConfig));
}

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