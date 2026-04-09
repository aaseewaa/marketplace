using Microsoft.EntityFrameworkCore;
using Mini_Marketplace.Data;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Repositories.Implementations
{
    public class CartRepository : BaseRepository<Cart>, ICartRepository
    {
        public CartRepository(MiniMarketplaceDbContext context) : base(context)
        {
        }

        public async Task<Cart?> GetCartWithItemsAsync(int userId) =>
            await _context.Carts.Include(c => c.CartItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        public async Task<CartItem?> GetCartItemAsync(int cartId, int productId) =>
            await _context.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);

        public async Task<CartItem> AddCartItemAsync(CartItem cartItem)
        {
            await _context.CartItems.AddAsync(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }

        public async Task UpdateCartItemAsync(CartItem cartItem)
        {
            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveCartItemAsync(CartItem cartItem)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task ClearCartAsync(int cartId)
        {
            var items = _context.CartItems.Where(ci => ci.CartId == cartId);
            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
        }
    }
}