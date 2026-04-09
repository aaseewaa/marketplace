using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Repositories.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order?> GetOrderWithItemsAsync(int orderId);
        Task<IEnumerable<Order>> GetUserOrdersAsync(int userId);
        Task<Order> CreateOrderAsync(Order order, List<OrderItem> items);
        Task UpdateOrderStatusAsync(Order order, string status);
    }
}