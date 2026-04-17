using Microsoft.EntityFrameworkCore;
using Mini_Marketplace.Data;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Repositories.Implementations
{
    public class ProductRepository : BaseRepository<Product>, IProductRepository
    {
        public ProductRepository(MiniMarketplaceDbContext context) : base(context)
        {
        }

        public async Task<List<Product>> GetUserProductsAsync(int userId) =>
            await _dbSet.Where(p => p.OwnerId == userId && p.DeletedAt == null)
            .Include(p => p.Owner)
            .ToListAsync();

        public async Task<List<Product>> GetActiveProductsAsync() =>
            await _dbSet.Where(p => p.DeletedAt == null && p.Quantity > 0)
            .Include(p => p.Owner)
            .ToListAsync();

        public async Task<Product?> GetProductWithOwnerAsync(int id) =>
            await _dbSet.Include(p => p.Owner)
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        public async Task<List<Product>> SearchProductsAsync(string? search, decimal? minPrice, decimal? maxPrice, string? sortBy, string? order)
        {
            var query = _dbSet.Where(p => p.DeletedAt == null && p.Quantity > 0).Include(p => p.Owner).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search));

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            sortBy = sortBy?.ToLower() ?? "created_at";
            order = order?.ToLower() ?? "desc";

            query = sortBy switch
            {
                "price" => order == "asc" ? query.OrderBy(p => p.Price) : query.OrderByDescending(p => p.Price),
                "name" => order == "asc" ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                _ => order == "asc" ? query.OrderBy(p => p.CreatedAt) : query.OrderByDescending(p => p.CreatedAt)
            };

            return await query.ToListAsync();
        }
    }
}