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
            Console.WriteLine($"Received Quantity: {request.Quantity}");
            Console.WriteLine($"Received ProductId: {request.ProductId}");
            var userId = GetCurrentUserId();
            var cart = await _cartRepository.GetCartWithItemsAsync(userId);

            if (cart == null)
            {
                Console.WriteLine("КОРЗИНА НЕ НАЙДЕНА????");
                return BadRequest("Cart not found");
            }

            var product = await _productRepository.GetByIdAsync(request.ProductId);
            if (product == null)
            {
                return BadRequest("Product not found");
            }

            if (product.Quantity < request.Quantity)
            {
                Console.WriteLine($"НЕ ДОСТАТОЧНО ЧЕГО????: {product.Quantity} < {request.Quantity}");
                return BadRequest("Not enough stock");
            }

            var existingItem = await _cartRepository.GetCartItemAsync(cart.Id, request.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
                await _cartRepository.UpdateCartItemAsync(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                await _cartRepository.AddCartItemAsync(cartItem);
            }

            return Ok(new MessageResponse("Item added to cart"));
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