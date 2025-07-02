using Leaves.Application.DTOs.Leaves;
using Leaves.Application.Interfaces;
using Leaves.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> GetAll()
    {
        var result = await _leaveService.GetAllLeaveRequestsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _leaveService.GetLeaveRequestByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployeeId(Guid employeeId)
    {
        var result = await _leaveService.GetLeaveRequestsByEmployeeIdAsync(employeeId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLeaveRequestRequest request)
    {
        var result = await _leaveService.CreateLeaveRequestAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateLeaveRequestRequest request)
    {
        var result = await _leaveService.UpdateLeaveRequestAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.DeleteLeaveRequestAsync(id);
        return NoContent();
    }

    [HttpGet("stats/pending")]
    public async Task<IActionResult> GetPendingCount()
    {
        var allRequests = await _leaveService.GetAllLeaveRequestsAsync();
        var pendingCount = allRequests.Count(r => r.Status == LeaveStatus.Pending);
        return Ok(new { count = pendingCount });
    }

    [HttpGet("stats/approved")]
    public async Task<IActionResult> GetApprovedCount()
    {
        var allRequests = await _leaveService.GetAllLeaveRequestsAsync();
        var approvedCount = allRequests.Count(r => r.Status == LeaveStatus.Approved);
        return Ok(new { count = approvedCount });
    }

    [HttpGet("stats/rejected")]
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
}