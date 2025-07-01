namespace Leaves.Application.Interfaces;

using Leaves.Application.DTOs.Leaves;

public interface ILeaveRequestService
{
    Task<LeaveRequestResponse> CreateLeaveRequestAsync(CreateLeaveRequestRequest request);
    Task<LeaveRequestResponse> UpdateLeaveRequestAsync(Guid id, UpdateLeaveRequestRequest request);
    Task ApproveLeaveRequestAsync(Guid id);
    Task RejectLeaveRequestAsync(Guid id);
    Task DeleteLeaveRequestAsync(Guid id);
    Task<LeaveRequestResponse?> GetLeaveRequestByIdAsync(Guid id);
    Task<IEnumerable<LeaveRequestResponse>> GetAllLeaveRequestsAsync();
    Task<IEnumerable<LeaveRequestResponse>> GetLeaveRequestsByEmployeeIdAsync(Guid employeeId);
}