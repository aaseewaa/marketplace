using System.Text.Json.Serialization;

namespace Mini_Marketplace.Models.DTO.Users
{
    public class UpdateProfileRequest
    {
        public string? Username { get; set; }
        public string? FullName { get; set; }
    }
}