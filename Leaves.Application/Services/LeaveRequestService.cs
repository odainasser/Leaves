using Leaves.Application.DTOs.Leaves;
using Leaves.Application.Interfaces;
using Leaves.Domain.Entities;
using Leaves.Domain.Enums;
using Leaves.Domain.Interfaces;

namespace Leaves.Application.Services;

public class LeaveRequestService : ILeaveRequestService
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;

    public LeaveRequestService(ILeaveRequestRepository leaveRequestRepository)
    {
        _leaveRequestRepository = leaveRequestRepository;
    }

    public async Task<LeaveRequestResponse> CreateLeaveRequestAsync(CreateLeaveRequestRequest request)
    {
        var leaveRequest = new LeaveRequest
        {
            Id = Guid.NewGuid(),
            EmployeeId = request.EmployeeId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Reason = request.Reason,
            Status = LeaveStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _leaveRequestRepository.AddAsync(leaveRequest);

        // Get the leave request with employee data loaded
        var createdLeaveRequest = await _leaveRequestRepository.GetByIdAsync(leaveRequest.Id);
        
        return MapToResponse(createdLeaveRequest!);
    }

    public async Task DeleteLeaveRequestAsync(Guid id)
    {
        var leave = await _leaveRequestRepository.GetByIdAsync(id)
            ?? throw new Exception("Leave request not found.");

        await _leaveRequestRepository.DeleteAsync(leave);
    }

    public async Task<IEnumerable<LeaveRequestResponse>> GetAllLeaveRequestsAsync()
    {
        var leaves = await _leaveRequestRepository.GetAllAsync();
        return leaves.Select(MapToResponse);
    }

    public async Task<LeaveRequestResponse?> GetLeaveRequestByIdAsync(Guid id)
    {
        var leave = await _leaveRequestRepository.GetByIdAsync(id);
        return leave is null ? null : MapToResponse(leave);
    }

    public async Task<IEnumerable<LeaveRequestResponse>> GetLeaveRequestsByEmployeeIdAsync(Guid employeeId)
    {
        var leaves = await _leaveRequestRepository.GetByEmployeeIdAsync(employeeId);
        return leaves.Select(MapToResponse);
    }

    public async Task<LeaveRequestResponse> UpdateLeaveRequestAsync(Guid id, UpdateLeaveRequestRequest request)
    {
        var leave = await _leaveRequestRepository.GetByIdAsync(id)
            ?? throw new Exception("Leave request not found.");

        leave.StartDate = request.StartDate;
        leave.EndDate = request.EndDate;
        leave.Reason = request.Reason;
        leave.UpdatedAt = DateTime.UtcNow;

        await _leaveRequestRepository.UpdateAsync(leave);

        return MapToResponse(leave);
    }

    public async Task ApproveLeaveRequestAsync(Guid id)
    {
        var leave = await _leaveRequestRepository.GetByIdAsync(id)
            ?? throw new Exception("Leave request not found.");

        leave.Status = LeaveStatus.Approved;
        leave.UpdatedAt = DateTime.UtcNow;

        await _leaveRequestRepository.UpdateAsync(leave);
    }

    public async Task RejectLeaveRequestAsync(Guid id)
    {
        var leave = await _leaveRequestRepository.GetByIdAsync(id)
            ?? throw new Exception("Leave request not found.");

        leave.Status = LeaveStatus.Rejected;
        leave.UpdatedAt = DateTime.UtcNow;

        await _leaveRequestRepository.UpdateAsync(leave);
    }

    private static LeaveRequestResponse MapToResponse(LeaveRequest leave)
    {
        return new LeaveRequestResponse
        {
            Id = leave.Id,
            EmployeeId = leave.EmployeeId,
            StartDate = leave.StartDate,
            EndDate = leave.EndDate,
            Reason = leave.Reason,
            Status = leave.Status,
            CreatedAt = leave.CreatedAt,
            UpdatedAt = leave.UpdatedAt,
            Employee = leave.Employee != null ? new EmployeeInfo
            {
                Id = leave.Employee.Id,
                FullName = leave.Employee.FullName,
                Email = leave.Employee.Email
            } : new EmployeeInfo
            {
                Id = leave.EmployeeId,
                FullName = "Unknown Employee",
                Email = "No email available"
            }
        };
    }
}