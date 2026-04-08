namespace Mini_Marketplace.Models.DTO.Orders
{
    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderRequest
    {
        public int DeliveryAddressId { get; set; }
        public List<OrderItemRequest> Items { get; set; } = new();
    }
}