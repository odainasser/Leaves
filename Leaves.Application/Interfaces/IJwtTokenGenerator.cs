using Leaves.Domain.Entities;

namespace Leaves.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}