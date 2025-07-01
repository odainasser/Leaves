using Leaves.Domain.Enums;

namespace Leaves.Application.DTOs.Users;

public class CreateUserRequest
{
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public UserRole Role { get; set; }
}