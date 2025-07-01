using Leaves.Application.Interfaces;
using Leaves.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Leaves.Application.DTOs.Users;
using Leaves.Domain.Entities;
using Leaves.Domain.Enums;

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

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        var existingUser = _context.Users.FirstOrDefault(x => x.Email == request.Email);
        if (existingUser != null)
            return BadRequest("User with this email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Employee,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
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