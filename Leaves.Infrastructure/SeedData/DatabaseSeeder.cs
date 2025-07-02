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
            var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@example.com");
            
            if (adminUser == null)
            {
                Console.WriteLine("Admin user not found. Creating admin user...");
                
                adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "Administrator",
                    Email = "admin@example.com",
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
            
            // Check if employee user specifically exists
            var employeeUser = context.Users.FirstOrDefault(u => u.Email == "employee@example.com");
            
            if (employeeUser == null)
            {
                Console.WriteLine("Employee user not found. Creating employee user...");
                
                employeeUser = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "John Employee",
                    Email = "employee@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("employee123"),
                    Role = UserRole.Employee,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(employeeUser);
                context.SaveChanges();
                
                Console.WriteLine($"Employee user created with email: {employeeUser.Email}");
            }
            else
            {
                Console.WriteLine($"Employee user already exists with email: {employeeUser.Email}");
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