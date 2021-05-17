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
