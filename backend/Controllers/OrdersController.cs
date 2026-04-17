using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Orders;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;
using System.Security.Claims;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly ICartRepository _cartRepository;

        public OrdersController(IOrderRepository orderRepository, IProductRepository productRepository, IAddressRepository addressRepository, ICartRepository cartRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _addressRepository = addressRepository;
            _cartRepository = cartRepository;
        }

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            var userId = GetCurrentUserId();

            var address = await _addressRepository.GetByIdAsync(request.DeliveryAddressId);
            if (address == null || address.UserId != userId)
                return BadRequest("Invalid delivery address");

            var orderItems = new List<Models.Entities.OrderItem>();
            decimal totalAmount = 0;

            foreach (var item in request.Items)
            {
                var product = await _productRepository.GetProductWithOwnerAsync(item.ProductId);
                if (product == null)
                {
                    Console.WriteLine("Product {item.ProductId} not found");
                    return BadRequest($"Product {item.ProductId} not found");
                }

                if (product.OwnerId == userId)
                {
                    Console.WriteLine("You cannot buy your own product");
                    return BadRequest("You cannot buy your own product");
                }

                if (product.Quantity < item.Quantity)
                {
                    Console.WriteLine("Not enough stock for product {product.Name}");
                    return BadRequest($"Not enough stock for product {product.Name}");
                }

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    PriceAtOrder = product.Price
                });

                totalAmount += product.Price * item.Quantity;
            }

            var order = new Order
            {
                BuyerId = userId,
                DeliveryAddressId = request.DeliveryAddressId,
                Status = "created",
                TotalAmount = totalAmount
            };

            var createdOrder = await _orderRepository.CreateOrderAsync(order, orderItems);

            var cart = await _cartRepository.GetCartWithItemsAsync(userId);
            if (cart != null && cart.CartItems.Any())
            {
                await _cartRepository.ClearCartAsync(cart.Id);
            }

            var response = await GetOrderResponse(createdOrder.Id);
            return Ok(response);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetCurrentUserId();
            var orders = await _orderRepository.GetUserOrdersAsync(userId);

            var result = orders.Select(o => new OrderResponse
            {
                Id = o.Id,
                BuyerId = o.BuyerId,
                DeliveryAddressId = o.DeliveryAddressId,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                CreatedAt = o.CreatedAt,
                CompletedAt = o.CompletedAt,
                CancelledAt = o.CancelledAt,
                Items = o.OrderItems.Select(i => new OrderItemResponse
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? string.Empty,
                    Quantity = i.Quantity,
                    PriceAtOrder = i.PriceAtOrder
                }).ToList()
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = GetCurrentUserId();
            var order = await _orderRepository.GetOrderWithItemsAsync(id);

            if (order == null)
                return NotFound();

            if (order.BuyerId != userId)
                return Forbid();

            var response = await GetOrderResponse(id);
            return Ok(response);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            var userId = GetCurrentUserId();
            var order = await _orderRepository.GetOrderWithItemsAsync(id);

            if (order == null)
                return NotFound();

            if (order.BuyerId != userId)
                return Forbid();

            if (!new[] { "completed", "cancelled" }.Contains(request.Status))
                return BadRequest("Invalid status");

            if (order.Status != "created")
                return BadRequest($"Cannot change status from {order.Status}");

            await _orderRepository.UpdateOrderStatusAsync(order, request.Status);

            var response = new
            {
                id = order.Id,
                status = order.Status,
                completed_at = order.CompletedAt,
                cancelled_at = order.CancelledAt
            };

            return Ok(response);
        }

        private async Task<OrderResponse> GetOrderResponse(int orderId)
        {
            var order = await _orderRepository.GetOrderWithItemsAsync(orderId);

            return new OrderResponse
            {
                Id = order!.Id,
                BuyerId = order.BuyerId,
                DeliveryAddressId = order.DeliveryAddressId,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                CompletedAt = order.CompletedAt,
                CancelledAt = order.CancelledAt,
                Items = order.OrderItems.Select(i => new OrderItemResponse
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? string.Empty,
                    Quantity = i.Quantity,
                    PriceAtOrder = i.PriceAtOrder
                }).ToList()
            };
        }
    }
}