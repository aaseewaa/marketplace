using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Repositories.Interfaces
{
    public interface IReviewRepository : IRepository<Review>
    {
        Task<IEnumerable<Review>> GetProductReviewsAsync(int productId);
        Task<Review?> GetUserProductReviewAsync(int userId, int productId);
        Task<double> GetAverageRatingAsync(int productId);
    }
}