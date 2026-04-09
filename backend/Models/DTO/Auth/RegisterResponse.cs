namespace Mini_Marketplace.Models.DTO.Auth
{
    public class RegisterResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}