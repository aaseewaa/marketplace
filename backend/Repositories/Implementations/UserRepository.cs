using Microsoft.EntityFrameworkCore;
using Mini_Marketplace.Data;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Repositories.Implementations
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(MiniMarketplaceDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email) =>
            await _dbSet.FirstOrDefaultAsync(u => u.Email == email && u.DeletedAt == null);

        public async Task<User?> GetByUsernameAsync(string username) =>
            await _dbSet.FirstOrDefaultAsync(u => u.Username == username && u.DeletedAt == null);

        public async Task<User?> GetUserWithDetailsAsync(int id) =>
            await _dbSet.Include(u => u.Products)
            .Include(u => u.DeliveryAddresses)
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null);

        public async Task<List<User>> GetAllActiveUsersAsync() =>
            await _dbSet.Where(u => u.DeletedAt == null).ToListAsync();
    }
}