using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enums;
using RookieOnlineAssetManagement.Filter;
using RookieOnlineAssetManagement.Helper;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize(Roles =RoleName.Admin)]
    [ApiController]
    [Route("api/[Controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AssetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllCategory(string location, int? state, string categoryName, [FromQuery] PaginationFilter filter, string keyword, string sortBy, bool asc = true)
        {
            
            var queryLocation = from a in _context.Assets
                                join b in _context.Categories
                                on a.CategoryId equals b.Id
                                where a.Location == location
                                select new
                                {
                                    Id = a.Id,
                                    AssetCode = a.AssetCode,
                                    AssetName = a.AssetName,
                                    CategoryName = b.Name,
                                    State = a.State
                                };
            var queryNotLocation = from a in _context.Assets
                                   join b in _context.Categories
                                   on a.CategoryId equals b.Id

                                   select new
                                   {
                                       Id = a.Id,
                                       AssetCode = a.AssetCode,
                                       AssetName = a.AssetName,
                                       CategoryName = b.Name,
                                       State = a.State
                                   };
            var query = !string.IsNullOrEmpty(location) ? queryLocation : queryNotLocation;
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(u => u.AssetName.Contains(keyword) || u.AssetCode.Contains(keyword));
            }
            if (!string.IsNullOrEmpty(categoryName))
            {
                query = query.Where(y => y.CategoryName==categoryName);
            }
            if (state!=null &&!string.IsNullOrEmpty(state.ToString()))
            {
                query = query.Where(z => z.State == (AssetState)state);
            }
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "assetCode":
                        query = asc ? query.OrderBy(u => u.AssetCode) : query.OrderByDescending(u => u.AssetCode);
                        break;
                    case "assetName":
                        query = asc ? query.OrderBy(u => u.AssetName) : query.OrderByDescending(u => u.AssetName);

                        break;
                    case "category":
                        query = asc ? query.OrderBy(u => u.CategoryName) : query.OrderByDescending(u => u.CategoryName);

                        break;
                    case "state":
                        query = asc ? query.OrderBy(u => u.State) : query.OrderByDescending(u => u.State);

                        break;
                    default:
                        query = asc ? query.OrderBy(u => u.Id) : query.OrderByDescending(u => u.Id);

                        break;

                }
            }

            var count = await query.CountAsync();
            var data = await query.Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize).ToListAsync();
            var response = PaginationHelper.CreatePagedResponse(data, filter.PageNumber, filter.PageSize, count);
            return Ok(response);
        }
        [HttpGet("{id}")]
        public IActionResult GetAssetById(int id)
        {
            var queryable = from a in _context.Assets
                            join b in _context.Categories
                            on a.CategoryId equals b.Id
                            where a.Id == id
                            select new
                            {
                                AssetId = a.Id,
                                AssetName = a.AssetName,
                                CategoryName = b.Name,
                                Specification = a.Specification,
                                InstalledDate = a.InstalledDate,
                                AssetState = a.State
                            };
            if (queryable == null)
            {
                return NotFound();
            }
            return Ok(queryable);

        }
        [HttpGet("{id}/Detail")]
        public async Task<IActionResult> GetAssetDetail(int id)
        {
            var asset = await _context.Assets.Include(x => x.Assignments.Where(x => x.AssetId == id)).SingleOrDefaultAsync(x => x.Id == id);
            if (asset == null)
            {
                return BadRequest();
            }

            return Ok(asset);
        }
        [HttpGet("GetAssetAvailable")]
        public async Task<IActionResult> GetAssetAvailable(string location, [FromQuery] PaginationFilter filter, string keyword, string sortBy, bool asc = true)
        {
            var queryLocation = from a in _context.Assets
                                join b in _context.Categories
                                on a.CategoryId equals b.Id
                                where a.Location == location
                                where a.State == AssetState.Available

                                select new
                                {
                                    Id = a.Id,
                                    AssetCode = a.AssetCode,
                                    AssetName = a.AssetName,
                                    CategoryName = b.Name

                                };
            var queryNotLocation = from a in _context.Assets
                                   join b in _context.Categories
                                   on a.CategoryId equals b.Id
                                   where a.State == AssetState.Available
                                   select new
                                   {
                                       Id = a.Id,
                                       AssetCode = a.AssetCode,
                                       AssetName = a.AssetName,
                                       CategoryName = b.Name

                                   };
            var query = !string.IsNullOrEmpty(location) ? queryLocation : queryNotLocation;
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(u => u.AssetName.Contains(keyword) || u.AssetCode.Contains(keyword));
            }
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "assetCode":
                        query = asc ? query.OrderBy(u => u.AssetCode) : query.OrderByDescending(u => u.AssetCode);
                        break;
                    case "assetName":
                        query = asc ? query.OrderBy(u => u.AssetName) : query.OrderByDescending(u => u.AssetName);

                        break;
                    case "category":
                        query = asc ? query.OrderBy(u => u.CategoryName) : query.OrderByDescending(u => u.CategoryName);
                        break;
                    default:
                        query = asc ? query.OrderBy(u => u.Id) : query.OrderByDescending(u => u.Id);
                        break;

                }
            }
            var count = await query.CountAsync();
            var data = await query.Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize).ToListAsync();
            var response = PaginationHelper.CreatePagedResponse(data, filter.PageNumber, filter.PageSize, count);
            return Ok(response);

        }
        [HttpPost]
        public async Task<IActionResult> CreateAsset(AssetModel asset)
        {

            var newasset = new Asset
            {
                AssetCode = "",
                AssetName = asset.AssetName,
                Specification = asset.Specification,
                State = asset.State,
                Location = asset.Location,
                InstalledDate = asset.InstalledDate,
                CategoryId = asset.CategoryId

            };
            _context.Assets.Add(newasset);
            _context.SaveChanges();
            var assetcode = AutoRenderAssetCode(newasset.CategoryId);
            if (assetcode != null)
            {
                var assetupdate = await _context.Assets.FindAsync(newasset.Id);
                assetupdate.AssetCode = assetcode;
                await _context.SaveChangesAsync();
                return Ok(assetupdate);

            }


            return Ok(newasset);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsset(int id, AssetModel asset)
        {
            var assetupdate = _context.Assets.SingleOrDefault(x => x.Id == id);
            if (assetupdate == null)
            {
                return NotFound();
            }
            assetupdate.AssetName = asset.AssetName;
            assetupdate.Specification = asset.Specification;
            assetupdate.InstalledDate = asset.InstalledDate;
            assetupdate.State = asset.State;
            await _context.SaveChangesAsync();
            return Ok(assetupdate);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = _context.Assets.SingleOrDefault(x => x.Id == id);
            if (asset == null)
            {
                return NotFound();
            }
            var assignAsset = _context.Assignments.FirstOrDefault(x => x.AssetId == id);
            if (assignAsset == null)
            {
                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();
                return Ok("Successful delete");
            }
            return BadRequest("Cannot delete the asset because it belongs to one or more historical assignments");
        }
        private string AutoRenderAssetCode(int categoryid)
        {
            string assetcode = "";
            var cate = _context.Categories.SingleOrDefault(x => x.Id == categoryid);
            var listAssetCode = new List<string>();
            var query = _context.Assets.Select(a =>a.AssetCode);
            listAssetCode.AddRange(query);
            for(int i = 1; i < 1000000; i++)
            {
                assetcode = cate.CategoryCode + i.ToString("d6");

                if (!listAssetCode.Contains(assetcode))
                {
                    return assetcode;
                }
            }
            


            return assetcode;
        }
        


    }
}
