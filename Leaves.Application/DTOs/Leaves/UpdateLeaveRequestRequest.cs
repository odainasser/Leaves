namespace Leaves.Application.DTOs.Leaves;

public class UpdateLeaveRequestRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
}