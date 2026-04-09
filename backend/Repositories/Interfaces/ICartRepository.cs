using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Repositories.Interfaces
{
    public interface ICartRepository : IRepository<Cart>
    {
        Task<Cart?> GetCartWithItemsAsync(int userId);
        Task<CartItem?> GetCartItemAsync(int cartId, int productId);
        Task<CartItem> AddCartItemAsync(CartItem cartItem);
        Task UpdateCartItemAsync(CartItem cartItem);
        Task RemoveCartItemAsync(CartItem cartItem);
        Task ClearCartAsync(int cartId);
    }
}