using Microsoft.EntityFrameworkCore;
using Mini_Marketplace.Data;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Repositories.Implementations
{
    public class AddressRepository : BaseRepository<DeliveryAddress>, IAddressRepository
    {
        public AddressRepository(MiniMarketplaceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DeliveryAddress>> GetUserAddressesAsync(int userId) =>
            await _dbSet.Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ToListAsync();

        public async Task<DeliveryAddress?> GetDefaultAddressAsync(int userId) =>
            await _dbSet.FirstOrDefaultAsync(a => a.UserId == userId && (bool)a.IsDefault);

        public async Task ResetDefaultAddressAsync(int userId)
        {
            var addresses = await _dbSet.Where(a => a.UserId == userId && (bool)a.IsDefault)
                .ToListAsync();

            foreach (var address in addresses)
            {
                address.IsDefault = false;
                _dbSet.Update(address);
            }

            await _context.SaveChangesAsync();
        }
    }
}