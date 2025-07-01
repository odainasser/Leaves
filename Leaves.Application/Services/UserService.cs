namespace Leaves.Application.Services;

using Leaves.Application.DTOs.Users;
using Leaves.Application.Interfaces;
using Leaves.Domain.Entities;
using Leaves.Domain.Interfaces;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserResponse> CreateUserAsync(CreateUserRequest request)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = !string.IsNullOrEmpty(request.Password) 
                ? BCrypt.Net.BCrypt.HashPassword(request.Password)
                : throw new ArgumentException("Password cannot be null or empty"),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        return MapToResponse(user);
    }

    public async Task<UserResponse> UpdateUserAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("User not found");

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.Role = request.Role;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        return MapToResponse(user);
    }

    public async Task DeleteUserAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("User not found");

        await _userRepository.DeleteAsync(user);
    }

    public async Task<UserResponse> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("User not found");

        return MapToResponse(user);
    }

    public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToResponse);
    }

    private static UserResponse MapToResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
}