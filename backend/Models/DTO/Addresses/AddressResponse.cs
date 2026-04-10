namespace Mini_Marketplace.Models.DTO.Addresses
{
    public class AddressResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string AddressLine { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
        public string? Country { get; set; } = string.Empty;
        public bool? IsDefault { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}