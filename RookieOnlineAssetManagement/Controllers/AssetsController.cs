using Microsoft.AspNetCore.Mvc;
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
        [HttpPost]
        public async Task<IActionResult> CreateAsset(AssetModel asset)
        {
            var code = AutoRenderAssetCode(asset.CategoryId);
            if (code == null) return BadRequest("Error!");
            var newasset = new Asset
            {
                AssetCode=code,
                AssetName=asset.AssetName,
                Specification=asset.Specification,
                State=asset.State,
                Location=asset.Location,
                InstalledDate=asset.InstalledDate

            };
             _context.Assets.Add(newasset);
            await _context.SaveChangesAsync();
            return Ok(newasset);
        }
        private string AutoRenderAssetCode(int categoryid)
        {
            string assetcode = "";
            var cate = _context.Categories.SingleOrDefault(x => x.Id == categoryid);
            for(int i = 1; i < 1000000; i++)
            {
                 assetcode = cate.CategoryCode + i.ToString("d6");
                var category = _context.Assets.SingleOrDefault(x => x.AssetCode == assetcode);
                if (category == null)
                {
                    return assetcode;
                   
                } 
            }
            assetcode = "";
            return assetcode;
        }


    }
}
