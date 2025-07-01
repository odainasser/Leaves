namespace Leaves.Application.Interfaces;

using Leaves.Application.DTOs.Users;

public interface IUserService
{
    Task<UserResponse> CreateUserAsync(CreateUserRequest request);
    Task<UserResponse> UpdateUserAsync(Guid id, UpdateUserRequest request);
    Task DeleteUserAsync(Guid id);
    Task<UserResponse> GetUserByIdAsync(Guid id);
    Task<IEnumerable<UserResponse>> GetAllUsersAsync();
}