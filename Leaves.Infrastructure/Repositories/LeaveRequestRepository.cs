using Leaves.Domain.Entities;
using Leaves.Domain.Interfaces;
using Leaves.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Leaves.Infrastructure.Repositories;

public class LeaveRequestRepository : ILeaveRequestRepository
{
    private readonly AppDbContext _context;

    public LeaveRequestRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(LeaveRequest leaveRequest)
    {
        await _context.LeaveRequests.AddAsync(leaveRequest);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(LeaveRequest leaveRequest)
    {
        _context.LeaveRequests.Update(leaveRequest);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(LeaveRequest leaveRequest)
    {
        _context.LeaveRequests.Remove(leaveRequest);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<LeaveRequest>> GetAllAsync()
    {
        return await _context.LeaveRequests
            .Include(lr => lr.Employee)
            .ToListAsync();
    }

    public async Task<LeaveRequest?> GetByIdAsync(Guid id)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.Id == id);
    }

    public async Task<IEnumerable<LeaveRequest>> GetByEmployeeIdAsync(Guid employeeId)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.Employee)
            .Where(lr => lr.EmployeeId == employeeId)
            .ToListAsync();
    }

    public async Task<IEnumerable<LeaveRequest>> GetAllWithEmployeeAsync()
    {
        return await _context.LeaveRequests
            .Include(lr => lr.Employee)
            .ToListAsync();
    }

    public async Task<LeaveRequest?> GetByIdWithEmployeeAsync(Guid id)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.Id == id);
    }
}