using Leaves.Domain.Entities;
using Leaves.Domain.Enums;
using Leaves.Infrastructure.Data;

namespace Leaves.Infrastructure.SeedData;

public static class DatabaseSeeder
{
    public static void Seed(AppDbContext context)
    {
        try
        {
            // Check if admin user specifically exists
            var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@admin.com");
            
            if (adminUser == null)
            {
                Console.WriteLine("Admin user not found. Creating admin user...");
                
                adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "Administrator",
                    Email = "admin@admin.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = UserRole.Admin,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                context.SaveChanges();
                
                Console.WriteLine($"Admin user created with email: {adminUser.Email}");
            }
            else
            {
                Console.WriteLine($"Admin user already exists with email: {adminUser.Email}");
            }
            
            // Log all existing users for debugging
            var allUsers = context.Users.ToList();
            Console.WriteLine($"Total users in database: {allUsers.Count}");
            foreach (var user in allUsers)
            {
                Console.WriteLine($"User: {user.Email} - {user.FullName} - Role: {user.Role}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during database seeding: {ex.Message}");
            throw;
        }
    }
}