using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Marketplace.Models.DTO.Addresses;
using Mini_Marketplace.Models.Entities;
using Mini_Marketplace.Models.Responses;
using Mini_Marketplace.Repositories.Interfaces;

namespace Mini_Marketplace.Controllers
{
    [ApiController]
    [Route("api/delivery-addresses")]
    [Authorize]
    public class DeliveryAddressesController : ControllerBase
    {
        private readonly IAddressRepository _addressRepository;

        public DeliveryAddressesController(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirst("nameid")?.Value ?? "0");

        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            var userId = GetCurrentUserId();
            var addresses = await _addressRepository.GetUserAddressesAsync(userId);

            var result = addresses.Select(a => new AddressResponse
            {
                Id = a.Id,
                UserId = a.UserId,
                AddressLine = a.AddressLine,
                City = a.City,
                PostalCode = a.PostalCode,
                Country = a.Country,
                IsDefault = a.IsDefault,
                CreatedAt = a.CreatedAt
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddress([FromBody] AddressRequest request)
        {
            var userId = GetCurrentUserId();

            if ((bool)request.IsDefault)
                await _addressRepository.ResetDefaultAddressAsync(userId);

            var address = new Models.Entities.DeliveryAddress
            {
                UserId = userId,
                AddressLine = request.AddressLine,
                City = request.City,
                PostalCode = request.PostalCode,
                Country = request.Country,
                IsDefault = request.IsDefault
            };

            var created = await _addressRepository.AddAsync(address);

            var response = new AddressResponse
            {
                Id = created.Id,
                UserId = created.UserId,
                AddressLine = created.AddressLine,
                City = created.City,
                PostalCode = created.PostalCode,
                Country = created.Country,
                IsDefault = created.IsDefault,
                CreatedAt = created.CreatedAt
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] AddressRequest request)
        {
            var userId = GetCurrentUserId();
            var address = await _addressRepository.GetByIdAsync(id);

            if (address == null)
                return NotFound();

            if (address.UserId != userId)
                return Forbid();

            if ((bool)request.IsDefault && (bool)!address.IsDefault)
                await _addressRepository.ResetDefaultAddressAsync(userId);

            address.AddressLine = request.AddressLine;
            address.City = request.City;
            address.PostalCode = request.PostalCode;
            address.Country = request.Country;
            address.IsDefault = request.IsDefault;

            await _addressRepository.UpdateAsync(address);

            var response = new AddressResponse
            {
                Id = address.Id,
                UserId = address.UserId,
                AddressLine = address.AddressLine,
                City = address.City,
                PostalCode = address.PostalCode,
                Country = address.Country,
                IsDefault = address.IsDefault,
                CreatedAt = address.CreatedAt
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var userId = GetCurrentUserId();
            var address = await _addressRepository.GetByIdAsync(id);

            if (address == null)
                return NotFound();

            if (address.UserId != userId)
                return Forbid();

            await _addressRepository.DeleteAsync(address);

            return Ok(new MessageResponse("Address deleted"));
        }
    }
}