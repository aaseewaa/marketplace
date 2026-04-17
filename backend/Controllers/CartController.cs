using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Cart;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Models.Responses;
using Mini_Marketplace.Repositories.Interfaces;
using System.Security.Claims;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartController(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetCurrentUserId();
            var cart = await _cartRepository.GetCartWithItemsAsync(userId);

            if (cart == null)
                return Ok(new CartResponse { Id = 0, UserId = userId, Items = new(), TotalAmount = 0 });

            var items = cart.CartItems.Select(i => new CartItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? string.Empty,
                Price = i.Product?.Price ?? 0,
                Quantity = i.Quantity,
                AddedAt = i.AddedAt
            }).ToList();

            var response = new CartResponse
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = items,
                TotalAmount = items.Sum(i => i.Price * i.Quantity)
            };

            return Ok(response);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemRequest request)
        {
            var userId = GetCurrentUserId();

            var cart = await _cartRepository.GetCartWithItemsAsync(userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _cartRepository.AddAsync(cart);

                cart = await _cartRepository.GetCartWithItemsAsync(userId);

                if (cart == null)
                {
                    return StatusCode(500, new { message = "Failed to create cart" });
                }
            }

            var product = await _productRepository.GetByIdAsync(request.ProductId);
            if (product == null)
            {
                return BadRequest(new { message = $"Product with ID {request.ProductId} not found" });
            }

            if (product.Quantity < request.Quantity)
            {
                return BadRequest(new { message = $"Not enough stock. Available: {product.Quantity}" });
            }

            var existingItem = cart.CartItems?.FirstOrDefault(i => i.ProductId == request.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
                existingItem.AddedAt = DateTime.UtcNow;
                await _cartRepository.UpdateCartItemAsync(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    AddedAt = DateTime.UtcNow
                };
                await _cartRepository.AddCartItemAsync(cartItem);
            }

            return Ok(new MessageResponse("Item added to cart successfully"));
        }

        [HttpPut("items/{itemId}")]
        public async Task<IActionResult> UpdateCartItem(int itemId, [FromBody] UpdateCartItemRequest request)
        {
            var userId = GetCurrentUserId();
            var cart = await _cartRepository.GetCartWithItemsAsync(userId);

            if (cart == null)
                return NotFound();

            var cartItem = cart.CartItems.FirstOrDefault(i => i.Id == itemId);
            if (cartItem == null)
                return NotFound();

            var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
            if (product == null)
                return BadRequest("Product not found");

            if (product.Quantity < request.Quantity)
                return BadRequest("Not enough stock");

            cartItem.Quantity = request.Quantity;
            await _cartRepository.UpdateCartItemAsync(cartItem);

            return Ok(new MessageResponse("Cart item updated"));
        }

        [HttpDelete("items/{itemId}")]
        public async Task<IActionResult> RemoveCartItem(int itemId)
        {
            var userId = GetCurrentUserId();
            var cart = await _cartRepository.GetCartWithItemsAsync(userId);

            if (cart == null)
                return NotFound();

            var cartItem = cart.CartItems.FirstOrDefault(i => i.Id == itemId);
            if (cartItem == null)
                return NotFound();

            await _cartRepository.RemoveCartItemAsync(cartItem);

            return Ok(new MessageResponse("Cart item deleted"));
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            var cart = await _cartRepository.GetCartWithItemsAsync(userId);

            if (cart == null)
                return NotFound();

            await _cartRepository.ClearCartAsync(cart.Id);

            return Ok(new { message = "Cart cleared" });
        }
    }
}