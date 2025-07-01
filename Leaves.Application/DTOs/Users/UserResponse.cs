using Leaves.Domain.Enums;

namespace Leaves.Application.DTOs.Users;

public class UserResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}