using Leaves.Application.Interfaces;
using Leaves.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Leaves.Application.DTOs.Users;

namespace Leaves.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthController(AppDbContext context, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginUserRequest request)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == request.Email);

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        var token = _jwtTokenGenerator.GenerateToken(user);

        var userResponse = new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };

        return Ok(new
        {
            token,
            user = userResponse
        });
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}