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
    public class AssetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AssetsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<Asset> GetAllCategory()
        {
            return _context.Assets.ToList();
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssetDetail(int id)
        {
            var asset = await _context.Assets.SingleOrDefaultAsync(x => x.Id == id);
            if (asset == null)
            {
                return BadRequest();
            }
            return Ok(asset);
        }
        [HttpPost]
        public async Task<IActionResult> CreateAsset(AssetModel asset)
        {
           
            var newasset = new Asset
            {
                AssetCode="",
                AssetName=asset.AssetName,
                Specification=asset.Specification,
                State=asset.State,
                Location=asset.Location,
                InstalledDate=asset.InstalledDate,
                CategoryId=asset.CategoryId

            };
             _context.Assets.Add(newasset);
             _context.SaveChanges();
            var assetcode = AutoRenderAssetCode(newasset.Id, newasset.CategoryId);
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
        public async Task<IActionResult> UpdateAsset(int id,AssetModel asset)
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
            if(asset == null)
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
        private string AutoRenderAssetCode(int assetId,int categoryid)
        {
            string assetcode = "";
            var cate = _context.Categories.SingleOrDefault(x => x.Id == categoryid);
            
                 assetcode = cate.CategoryCode + assetId.ToString("d6");
                var category = _context.Assets.SingleOrDefault(x => x.AssetCode == assetcode);
                if (category == null)
                {
                    return assetcode;
                   
                } 
            
            
            return assetcode;
        }


    }
}
