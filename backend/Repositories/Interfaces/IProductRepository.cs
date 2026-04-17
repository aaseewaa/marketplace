using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<List<Product>> GetUserProductsAsync(int userId);
        Task<List<Product>> GetActiveProductsAsync();
        Task<Product?> GetProductWithOwnerAsync(int id);
        Task<List<Product>> SearchProductsAsync(string? search, decimal? minPrice, decimal? maxPrice, string? sortBy, string? order);
    }
}