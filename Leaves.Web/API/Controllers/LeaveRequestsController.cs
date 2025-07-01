using Leaves.Application.DTOs.Leaves;
using Leaves.Application.Interfaces;
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

    // GET: api/LeaveRequests
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _leaveService.GetAllLeaveRequestsAsync();
        return Ok(result);
    }

    // GET: api/LeaveRequests/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _leaveService.GetLeaveRequestByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    // GET: api/LeaveRequests/employee/{employeeId}
    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployeeId(Guid employeeId)
    {
        var result = await _leaveService.GetLeaveRequestsByEmployeeIdAsync(employeeId);
        return Ok(result);
    }

    // POST: api/LeaveRequests
    [HttpPost]
    public async Task<IActionResult> Create(CreateLeaveRequestRequest request)
    {
        var result = await _leaveService.CreateLeaveRequestAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // PUT: api/LeaveRequests/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateLeaveRequestRequest request)
    {
        var result = await _leaveService.UpdateLeaveRequestAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }

    // DELETE: api/LeaveRequests/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.DeleteLeaveRequestAsync(id);
        return NoContent();
    }

    // PATCH: api/LeaveRequests/{id}/approve
    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.ApproveLeaveRequestAsync(id);
        return Ok(new { message = "Leave request approved." });
    }

    // PATCH: api/LeaveRequests/{id}/reject
    [HttpPatch("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var existing = await _leaveService.GetLeaveRequestByIdAsync(id);
        if (existing is null)
            return NotFound();

        await _leaveService.RejectLeaveRequestAsync(id);
        return Ok(new { message = "Leave request rejected." });
    }
}