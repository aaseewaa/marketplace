namespace Mini_Marketplace.Models.DTO.Addresses
{
    public class AddressRequest
    {
        public string AddressLine { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
        public string Country { get; set; } = "Russia";
        public bool IsDefault { get; set; }
    }
}