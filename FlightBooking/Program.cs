using FlightBooking.AgentServices;
using FlightBooking.AgentServices.IntentDetectors;
using FlightBooking.AgentServices.OpenAIServices;
using FlightBooking.AgentServices.PromptBuilders;
using FlightBooking.AgentSettings;
using FlightBooking.Services.BookingServices;
using FlightBooking.Services.CheckInServices;
using FlightBooking.Services.FlightServices;
using FlightBooking.Services.MachineLearningServices;
using FlightBooking.Services.NoShowServices;
using FlightBooking.Services.OverBookingNoShowServices;
using FlightBooking.Settings;
using Microsoft.Extensions.Options;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddScoped<IFlightService, FlightService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<ICheckInService, CheckInService>();
builder.Services.AddSingleton<FlightRegressionService>();
builder.Services.AddScoped<NoShowService>();
builder.Services.AddScoped<OverbookingRecommendationService>();
builder.Services.AddScoped<NoShowPredictionService>();
builder.Services.AddScoped<ITravelAgentService, TravelAgentService>();
builder.Services.AddScoped<IOpenAIService, OpenAIService>();
builder.Services.Configure<OpenAISettings>(builder.Configuration.GetSection("OpenAI"));
builder.Services.AddScoped<ITravelPromptBuilder, TravelPromptBuilder>();
builder.Services.AddScoped<IIntentDetector, TravelIntentDetector>();
builder.Services.AddHttpClient();

builder.Services.AddSingleton<FlightMlService>();
builder.Services.AddScoped<MongoFlightDataService>();

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DatabaseSettingsKey"));
builder.Services.AddScoped<IDatabaseSettings>(sp =>
{
    return sp.GetRequiredService<IOptions<DatabaseSettings>>().Value;
});

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
      name: "areas",
      pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
    );
});

app.Run();
