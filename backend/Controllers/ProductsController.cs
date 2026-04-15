using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Products;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Models.Responses;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public ProductsController(IProductRepository productRepository, IUserRepository userRepository)
        {
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirst("nameid")?.Value ?? "0");

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProduct([FromBody] ProductRequest request)
        {
            var userId = GetCurrentUserId();
            var user = await _userRepository.GetByIdAsync(userId);

            var product = new Product
            {
                OwnerId = userId,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Quantity = request.Quantity,
                ImageUrl = request.ImageUrl
            };

            var created = await _productRepository.AddAsync(product);

            var response = new ProductResponse
            {
                Id = created.Id,
                OwnerId = created.OwnerId,
                OwnerUsername = user?.Username ?? string.Empty,
                Name = created.Name,
                Description = created.Description,
                Price = created.Price,
                Quantity = created.Quantity,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt,
                ImageUrl = created.ImageUrl
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] string? search, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? sortBy, [FromQuery] string? order)
        {
            var products = await _productRepository.SearchProductsAsync(search, minPrice, maxPrice, sortBy, order);

            var result = products.Select(p => new ProductResponse
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                OwnerUsername = p.Owner?.Username ?? string.Empty,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Quantity = p.Quantity,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                ImageUrl = p.ImageUrl
            });

            return Ok(result);
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyProducts()
        {
            var userId = GetCurrentUserId();
            var products = await _productRepository.GetUserProductsAsync(userId);

            var result = products.Select(p => new ProductResponse
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                OwnerUsername = p.Owner?.Username ?? string.Empty,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Quantity = p.Quantity,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                ImageUrl = p.ImageUrl,
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productRepository.GetProductWithOwnerAsync(id);

            if (product == null)
                return NotFound();

            var result = new ProductResponse
            {
                Id = product.Id,
                OwnerId = product.OwnerId,
                OwnerUsername = product.Owner?.Username ?? string.Empty,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                ImageUrl = product.ImageUrl
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductRequest request)
        {
            var userId = GetCurrentUserId();
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return NotFound();

            if (product.OwnerId != userId)
                return Forbid();

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Quantity = request.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
            product.ImageUrl = request.ImageUrl;

            await _productRepository.UpdateAsync(product);

            var user = await _userRepository.GetByIdAsync(userId);

            var response = new ProductResponse
            {
                Id = product.Id,
                OwnerId = product.OwnerId,
                OwnerUsername = user?.Username ?? string.Empty,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                ImageUrl = product.ImageUrl
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var userId = GetCurrentUserId();
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return NotFound();

            if (product.OwnerId != userId)
                return Forbid();

            product.DeletedAt = DateTime.UtcNow;
            await _productRepository.UpdateAsync(product);

            return Ok(new MessageResponse("Product deleted"));
        }
    }
}