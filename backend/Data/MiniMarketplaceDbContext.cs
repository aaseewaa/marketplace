using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Mini_Marketplace.Models.Entities;

namespace Mini_Marketplace.Data;

public partial class MiniMarketplaceDbContext : DbContext
{
    public MiniMarketplaceDbContext()
    {
    }

    public MiniMarketplaceDbContext(DbContextOptions<MiniMarketplaceDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<DeliveryAddress> DeliveryAddresses { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=Mini-Marketplace;Username=postgres;Password=1111");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("carts_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UserId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.User).WithOne(p => p.Cart).HasConstraintName("carts_user_id_fkey");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("cart_items_pkey");

            entity.Property(e => e.AddedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.CartId).ValueGeneratedOnAdd();
            entity.Property(e => e.ProductId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.Cart).WithMany(p => p.CartItems).HasConstraintName("cart_items_cart_id_fkey");

            entity.HasOne(d => d.Product).WithMany(p => p.CartItems)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("cart_items_product_id_fkey");
        });

        modelBuilder.Entity<DeliveryAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("delivery_addresses_pkey");

            entity.Property(e => e.Country).HasDefaultValueSql("'Russia'::character varying");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.UserId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.User).WithMany(p => p.DeliveryAddresses).HasConstraintName("delivery_addresses_user_id_fkey");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("orders_pkey");

            entity.Property(e => e.BuyerId).ValueGeneratedOnAdd();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.DeliveryAddressId).ValueGeneratedOnAdd();
            entity.Property(e => e.Status).HasDefaultValueSql("'created'::character varying");

            entity.HasOne(d => d.Buyer).WithMany(p => p.Orders)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("orders_buyer_id_fkey");

            entity.HasOne(d => d.DeliveryAddress).WithMany(p => p.Orders)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("orders_delivery_address_id_fkey");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("order_items_pkey");

            entity.Property(e => e.OrderId).ValueGeneratedOnAdd();
            entity.Property(e => e.ProductId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems).HasConstraintName("order_items_order_id_fkey");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("order_items_product_id_fkey");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("products_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.OwnerId).ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Owner).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("products_owner_id_fkey");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("reviews_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.ProductId).ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UserId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.Product).WithMany(p => p.Reviews).HasConstraintName("reviews_product_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews).HasConstraintName("reviews_user_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("now()");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
