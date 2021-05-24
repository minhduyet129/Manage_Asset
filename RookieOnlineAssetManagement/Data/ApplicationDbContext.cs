using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Entities;
using System;

namespace RookieOnlineAssetManagement.Data
{
    public class ApplicationDbContext
        : IdentityDbContext<ApplicationUser, ApplicationRole, int, IdentityUserClaim<int>,
            ApplicationUserRole, IdentityUserLogin<int>,
            IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Asset> Assets { get; set; }
        public virtual DbSet<Assignment> Assignments { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<ReturnRequest> ReturnRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Assignment>()
                 .HasOne(a => a.AssignBy)
                 .WithMany(u => u.AssignmentsBy)
                 .HasForeignKey(a => a.AssignById)
                 .OnDelete(DeleteBehavior.Restrict)
                 .IsRequired();

            builder.Entity<Assignment>()
                 .HasOne(a => a.AssignTo)
                 .WithMany(u => u.AssignmentsTo)
                 .HasForeignKey(a => a.AssignToId)
                 .OnDelete(DeleteBehavior.Restrict)
                 .IsRequired();
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.CountLogin).HasDefaultValue(0);
            });
            

                
            builder.Entity<ApplicationUserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

        }
    }
}
