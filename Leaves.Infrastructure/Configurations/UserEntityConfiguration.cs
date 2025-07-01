using Leaves.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Leaves.Infrastructure.Configurations;

public class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
       public void Configure(EntityTypeBuilder<User> builder)
       {
              builder.ToTable("Users");

              builder.HasKey(u => u.Id);

              builder.Property(u => u.FullName)
                     .IsRequired()
                     .HasMaxLength(100);

              builder.Property(u => u.Email)
                     .IsRequired()
                     .HasMaxLength(100);

              builder.HasIndex(u => u.Email)
                     .IsUnique();

              builder.Property(u => u.PasswordHash)
                     .IsRequired();

              builder.Property(u => u.Role)
                     .HasConversion<int>()
                     .IsRequired();

              builder.Property(u => u.CreatedAt)
                     .IsRequired();

              builder.Property(u => u.UpdatedAt)
                     .IsRequired(false);
               
              builder.HasMany(x => x.LeaveRequests)
                     .WithOne(x => x.Employee)
                     .HasForeignKey(x => x.EmployeeId);
    }
}