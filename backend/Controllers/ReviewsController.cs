using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Reviews;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Repositories.Interfaces;
using System.Security.Claims;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/products/{productId}/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IProductRepository _productRepository;
        private readonly IOrderRepository _orderRepository;

        public ReviewsController(IReviewRepository reviewRepository, IProductRepository productRepository, IOrderRepository orderRepository)
        {
            _reviewRepository = reviewRepository;
            _productRepository = productRepository;
            _orderRepository = orderRepository;
        }

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpGet]
        public async Task<IActionResult> GetProductReviews(int productId)
        {
            var reviews = await _reviewRepository.GetProductReviewsAsync(productId);

            var result = reviews.Select(r => new ReviewResponse
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                Username = r.User?.Username ?? string.Empty,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            });

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview(int productId, [FromBody] ReviewRequest request)
        {
            var userId = GetCurrentUserId();

            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
                return NotFound("Product not found");

            var orders = await _orderRepository.GetUserOrdersAsync(userId);
            var hasBought = orders
                .Where(o => o.Status == "completed")
                .SelectMany(o => o.OrderItems)
                .Any(i => i.ProductId == productId);

            if (!hasBought)
                return BadRequest("You can only review products you have purchased");

            var existingReview = await _reviewRepository.GetUserProductReviewAsync(userId, productId);
            if (existingReview != null)
                return BadRequest("You have already reviewed this product");

            var review = new Review
            {
                ProductId = productId,
                UserId = userId,
                Rating = request.Rating,
                Comment = request.Comment
            };

            var created = await _reviewRepository.AddAsync(review);

            var response = new ReviewResponse
            {
                Id = created.Id,
                ProductId = created.ProductId,
                UserId = created.UserId,
                Username = (await _reviewRepository.GetByIdAsync(created.Id))?.User?.Username ?? string.Empty,
                Rating = created.Rating,
                Comment = created.Comment,
                CreatedAt = created.CreatedAt
            };

            return Ok(response);
        }
    }
}