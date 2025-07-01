namespace Leaves.Domain.Entities;

using Leaves.Domain.Enums;

public class LeaveRequest
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = default!;

    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public User Employee { get; set; } = default!;
}