using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Entities;
using System;

namespace RookieOnlineAssetManagement.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
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

        }
    }
}
