using Microsoft.EntityFrameworkCore;
using Leaves.Infrastructure.Data;
using Leaves.Domain.Interfaces;
using Leaves.Infrastructure.Repositories;
using Leaves.Application.Services;
using Leaves.Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Leaves.Infrastructure.Settings;
using Leaves.Infrastructure.Authentication;
using Microsoft.OpenApi.Models;
using Leaves.Infrastructure.SeedData;

var builder = WebApplication.CreateBuilder(args);

// ----------------------------------------------------
// 🔗 Configure Database
// ----------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ----------------------------------------------------
// 🔗 Configure CORS
// ----------------------------------------------------
var allowedOrigins = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000") // Next.js Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromSeconds(86400)) // Cache preflight for 24 hours
              .WithExposedHeaders("*"); // Expose all headers
    });

    // Add a more permissive policy for development
    options.AddPolicy("Development", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ----------------------------------------------------
// 🔗 Configure JWT Authentication
// ----------------------------------------------------
var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettingsSection);
var jwtSettings = jwtSettingsSection.Get<JwtSettings>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),

            ClockSkew = TimeSpan.Zero // Token expires exactly
        };
    });

// ----------------------------------------------------
// 🔗 Dependency Injection
// ----------------------------------------------------
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILeaveRequestRepository, LeaveRequestRepository>();
builder.Services.AddScoped<ILeaveRequestService, LeaveRequestService>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// ----------------------------------------------------
// 🔗 FluentValidation
// ----------------------------------------------------
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Leaves.Application.Validators.Users.CreateUserRequestValidator>();

// ----------------------------------------------------
// 🔗 Controllers
// ----------------------------------------------------
builder.Services.AddControllers();

// ----------------------------------------------------
// 🔗 Swagger (With JWT Authorization Button)
// ----------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Leaves API", Version = "v1" });

    // 🔐 JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. 
                        Enter 'Bearer' [space] and then your token in the text input below.
                        Example: 'Bearer eyJhbGci...'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// ----------------------------------------------------
// 🔥 Build App
// ----------------------------------------------------
var app = builder.Build();

// ----------------------------------------------------
// 🔗 Database Migration + Seeding
// ----------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.Migrate(); // Run pending migrations
        DatabaseSeeder.Seed(context); // Seed Admin User
        Console.WriteLine("✅ Database seeding completed.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ DB Error: {ex.Message}");
    }
}

// ----------------------------------------------------
// 🔗 Middleware Pipeline
// ----------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "openapi/{documentName}.json";
    });
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/openapi/v1.json", "Leaves API V1");
    });
}

app.UseHttpsRedirection();

// Use different CORS policy based on environment
if (app.Environment.IsDevelopment())
{
    app.UseCors("Development");
}
else
{
    app.UseCors(allowedOrigins);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();