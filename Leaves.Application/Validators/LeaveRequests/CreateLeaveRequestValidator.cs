using FluentValidation;
using Leaves.Application.DTOs.Leaves;

namespace Leaves.Application.Validators.LeaveRequests;

public class CreateLeaveRequestValidator : AbstractValidator<CreateLeaveRequestRequest>
{
    public CreateLeaveRequestValidator()
    {
        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required")
            .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Start date cannot be in the past");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be on or after start date");


        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Reason is required")
            .MaximumLength(500).WithMessage("Reason cannot exceed 500 characters");
    }
}
