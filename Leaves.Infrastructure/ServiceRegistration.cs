using Leaves.Application.Interfaces;
using Leaves.Infrastructure.Authentication;
using Microsoft.Extensions.DependencyInjection;

namespace Leaves.Infrastructure;

public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // Register JWT token generator
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Register other infrastructure services like DB context, repositories, etc.

        return services;
    }
}