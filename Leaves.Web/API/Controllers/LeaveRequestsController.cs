using Leaves.Application.DTOs.Leaves;
using Leaves.Application.Interfaces;
using Leaves.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Leaves.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class LeaveRequestsController : ControllerBase
{
    private readonly ILeaveRequestService _leaveService;

    public LeaveRequestsController(ILeaveRequestService leaveService)
    {
        _leaveService = leaveService;
    }

    [HttpGet]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> GetAll()
    {
        var result = await _leaveService.GetAllLeaveRequestsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _leaveService.GetLeaveRequestByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("employee/{employeeId}")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> GetByEmployeeId(Guid employeeId)
    {
        var result = await _leaveService.GetLeaveRequestsByEmployeeIdAsync(employeeId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> Create(CreateLeaveRequestRequest request)
    {
        var result = await _leaveService.CreateLeaveRequestAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> Update(Guid id, UpdateLeaveRequestRequest request)
    {
        var result = await _leaveService.UpdateLeaveRequestAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.DeleteLeaveRequestAsync(id);
        return NoContent();
    }

    [HttpGet("stats/pending")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> GetPendingCount()
    {
        var allRequests = await _leaveService.GetAllLeaveRequestsAsync();
        var pendingCount = allRequests.Count(r => r.Status == LeaveStatus.Pending);
        return Ok(new { count = pendingCount });
    }

    [HttpGet("stats/approved")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> GetApprovedCount()
    {
        var allRequests = await _leaveService.GetAllLeaveRequestsAsync();
        var approvedCount = allRequests.Count(r => r.Status == LeaveStatus.Approved);
        return Ok(new { count = approvedCount });
    }

    [HttpGet("stats/rejected")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> GetRejectedCount()
    {
        var allRequests = await _leaveService.GetAllLeaveRequestsAsync();
        var rejectedCount = allRequests.Count(r => r.Status == LeaveStatus.Rejected);
        return Ok(new { count = rejectedCount });
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> Approve(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.ApproveLeaveRequestAsync(id);
        return Ok(new { message = "Leave request approved." });
    }

    [HttpPatch("{id}/reject")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public async Task<IActionResult> Reject(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.RejectLeaveRequestAsync(id);
        return Ok(new { message = "Leave request rejected." });
    }

    [HttpGet("my-requests")]
    public async Task<IActionResult> GetMyLeaveRequests()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return BadRequest("Invalid user ID");

        var result = await _leaveService.GetLeaveRequestsByEmployeeIdAsync(userId);
        return Ok(result);
    }

    [HttpGet("my-requests/{id}")]
    public async Task<IActionResult> GetMyLeaveRequestById(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return BadRequest("Invalid user ID");

        var result = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (result is null)
            return NotFound();

        // Check if the leave request belongs to the current user
        if (result.EmployeeId != userId)
            return Forbid("You can only view your own leave requests");

        return Ok(result);
    }

    [HttpPost("my-requests")]
    public async Task<IActionResult> CreateMyLeaveRequest(CreateLeaveRequestRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(new { message = "Invalid user ID" });

            // Override the employee ID with the logged-in user's ID
            request.EmployeeId = userId;

            // Validate the request
            if (request.StartDate >= request.EndDate)
                return BadRequest(new { message = "End date must be after start date" });

            if (string.IsNullOrWhiteSpace(request.Reason))
                return BadRequest(new { message = "Reason is required" });

            var result = await _leaveService.CreateLeaveRequestAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to create leave request", error = ex.Message });
        }
    }

    [HttpPut("my-requests/{id}")]
    public async Task<IActionResult> UpdateMyLeaveRequest(Guid id, UpdateLeaveRequestRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return BadRequest("Invalid user ID");

        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        // Check if the leave request belongs to the current user
        if (existing.EmployeeId != userId)
            return Forbid("You can only edit your own leave requests");

        // Only allow editing pending requests
        if (existing.Status != LeaveStatus.Pending)
            return BadRequest("You can only edit pending leave requests");

        var result = await _leaveService.UpdateLeaveRequestAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("my-requests/{id}")]
    public async Task<IActionResult> DeleteMyLeaveRequest(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return BadRequest("Invalid user ID");

        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        // Check if the leave request belongs to the current user
        if (existing.EmployeeId != userId)
            return Forbid("You can only delete your own leave requests");

        // Only allow deleting pending requests
        if (existing.Status != LeaveStatus.Pending)
            return BadRequest("You can only delete pending leave requests");

        await _leaveService.DeleteLeaveRequestAsync(id);
        return NoContent();
    }
}