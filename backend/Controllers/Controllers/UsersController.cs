using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Users;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllActiveUsersAsync();
            var result = users.Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                Username = u.Username,
                FullName = u.FullName
            });

            return Ok(result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst("nameid")?.Value ?? "0");
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return NotFound();

            var result = new UserDetailDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                FullName = user.FullName,
                CreatedAt = user.CreatedAt
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            var result = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                FullName = user.FullName
            };

            return Ok(result);
        }
    }
}