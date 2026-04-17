using Mini_Marketplace.Models.DTO.Users;

namespace Mini_Marketplace.Models.DTO.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }
}