namespace Leaves.Application.DTOs.Users;

using Leaves.Domain.Enums;

public class CreateUserRequest
{
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public UserRole Role { get; set; }
}