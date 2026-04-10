namespace Mini_Marketplace.Models.DTO.Orders
{
    public class OrderItemResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal PriceAtOrder { get; set; }
    }

    public class OrderResponse
    {
        public int Id { get; set; }
        public int BuyerId { get; set; }
        public int DeliveryAddressId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}