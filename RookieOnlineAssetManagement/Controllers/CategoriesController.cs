using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CategoriesController : ControllerBase

    {
        private readonly ApplicationDbContext _context;
        public CategoriesController (ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CategoryModel category)
        {
            var catename = _context.Categories.SingleOrDefault(x => x.Name == category.Name);
            if (catename != null)
            {
                return BadRequest("Category name exist!");
            }
            var catecode = _context.Categories.SingleOrDefault(x => x.CategoryCode == category.CategoryCode);
            if (catecode != null)
            {
                return BadRequest("Category code exist!");
            }
            var newcategory = new Category
            {
                CategoryCode = category.CategoryCode,
                Name = category.Name
            };
            await _context.Categories.AddAsync(newcategory);
            await _context.SaveChangesAsync();
            return Ok("Create category succeed!");
        }
    }
}
