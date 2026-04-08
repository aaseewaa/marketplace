using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mini_Marketplace.Models.Entities;

[Table("orders")]
public partial class Order
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("buyer_id")]
    public int BuyerId { get; set; }

    [Column("delivery_address_id")]
    public int DeliveryAddressId { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = null!;

    [Column("total_amount")]
    [Precision(12, 2)]
    public decimal TotalAmount { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("completed_at")]
    public DateTime? CompletedAt { get; set; }

    [Column("cancelled_at")]
    public DateTime? CancelledAt { get; set; }

    [ForeignKey("BuyerId")]
    [InverseProperty("Orders")]
    public virtual User Buyer { get; set; } = null!;

    [ForeignKey("DeliveryAddressId")]
    [InverseProperty("Orders")]
    public virtual DeliveryAddress DeliveryAddress { get; set; } = null!;

    [InverseProperty("Order")]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
