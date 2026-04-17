using Microsoft.EntityFrameworkCore;
using Mini_Marketplace.Data;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Repositories.Implementations
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        public OrderRepository(MiniMarketplaceDbContext context) : base(context)
        {
        }

        public async Task<Order?> GetOrderWithItemsAsync(int orderId) =>
            await _dbSet.Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.DeliveryAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        public async Task<IEnumerable<Order>> GetUserOrdersAsync(int userId)
        {
            return await _dbSet
                .Where(o => o.BuyerId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order> CreateOrderAsync(Order order, List<OrderItem> items)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                await _dbSet.AddAsync(order);
                await _context.SaveChangesAsync();

                foreach (var item in items)
                {
                    item.OrderId = order.Id;
                    await _context.OrderItems.AddAsync(item);

                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Quantity -= item.Quantity;
                        _context.Products.Update(product);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return order;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateOrderStatusAsync(Order order, string status)
        {
            order.Status = status;

            if (status == "completed")
            {
                order.CompletedAt = DateTime.UtcNow;
            }
            else if (status == "cancelled")
            {
                order.CancelledAt = DateTime.UtcNow;

                var items = await _context.OrderItems
                    .Where(oi => oi.OrderId == order.Id)
                    .ToListAsync();

                foreach (var item in items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Quantity += item.Quantity;
                        _context.Products.Update(product);
                    }
                }
            }

            _dbSet.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}