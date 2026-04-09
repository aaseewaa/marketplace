using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Auth;
using Mini_Marketplace.Models.DTO.Users;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;
using Mini_Marketplace.Services;
using RegisterRequest = Mini_Marketplace.Models.DTO.Auth.RegisterRequest;
using LoginRequest = Mini_Marketplace.Models.DTO.Auth.LoginRequest;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public AuthController(IUserRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponse), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existingByEmail = await _userRepository.GetByEmailAsync(request.Email);
            if (existingByEmail != null)
                return BadRequest(new { message = "User with this email already exists" });

            var existingByUsername = await _userRepository.GetByUsernameAsync(request.Username);
            if (existingByUsername != null)
                return BadRequest(new { message = "User with this username already exists" });

            var user = new User
            {
                Email = request.Email,
                Username = request.Username,
                PasswordHash = _authService.HashPassword(request.Password),
                FullName = request.FullName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.AddAsync(user);

            var response = new RegisterResponse
            {
                Id = createdUser.Id,
                Email = createdUser.Email,
                Username = createdUser.Username,
                FullName = createdUser.FullName,
                CreatedAt = createdUser.CreatedAt
            };

            return Ok(response);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var token = _authService.GenerateJwtToken(user);

            var response = new LoginResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username,
                    FullName = user.FullName
                }
            };

            return Ok(response);
        }
    }
}