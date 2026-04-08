namespace Mini_Marketplace.Models.DTO.Products
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string OwnerUsername { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}