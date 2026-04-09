using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Repositories.Interfaces
{
    public interface IAddressRepository : IRepository<DeliveryAddress>
    {
        Task<IEnumerable<DeliveryAddress>> GetUserAddressesAsync(int userId);
        Task<DeliveryAddress?> GetDefaultAddressAsync(int userId);
        Task ResetDefaultAddressAsync(int userId);
    }
}