using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }
}