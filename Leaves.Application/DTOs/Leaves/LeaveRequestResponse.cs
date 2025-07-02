using Leaves.Domain.Enums;

namespace Leaves.Application.DTOs.Leaves;

public class LeaveRequestResponse
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public LeaveStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public EmployeeInfo Employee { get; set; } = new();
}

public class EmployeeInfo
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}