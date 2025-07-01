namespace Leaves.Application.DTOs.Users;

using Leaves.Domain.Enums;

public class UserResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}