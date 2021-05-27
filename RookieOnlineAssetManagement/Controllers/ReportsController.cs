using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult ReportList()
        {
            try
            {
                var query = from c in _context.Categories.Include(c => c.Assets)
                            select new
                            {
                                CategoryName = c.Name,
                                Total = c.Assets.Count,
                                Assgined = c.Assets.Count(a => a.State == AssetState.Assigned),
                                Available = c.Assets.Count(a => a.State == AssetState.Available),
                                NotAvailable = c.Assets.Count(a => a.State == AssetState.NotAvailable),
                                WaitingForRecycling = c.Assets.Count(a => a.State == AssetState.WaitingForRecycling),
                                WaitingForApproval = c.Assets.Count(a => a.State == AssetState.WaitingForApproval),
                                Recycled = c.Assets.Count(a => a.State == AssetState.Recycled),
                            };

                return Ok(query);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }     

        }
        //[HttpGet("duyet")]
        //public IActionResult Get(string location)
        //{
        //    var query = from a in _context.Assets
        //                join b in _context.Categories
        //                on a.CategoryId equals b.Id
        //                where a.Location == location
        //                group  a by b.Name into gr
        //                select new
        //                {
        //                    Cate = gr.Key,
        //                    Total = gr.Count(),
        //                    Assigned = gr.Count(u => u.State == AssetState.Assigned),
        //                    NotAvailable = gr.Count(u => u.State == AssetState.NotAvailable),
        //                    Available = gr.Count(u => u.State == AssetState.Available),
        //                    WaitingForRecycling = gr.Count(u => u.State == AssetState.WaitingForRecycling),
        //                    WaitingForApproval = gr.Count(u => u.State == AssetState.WaitingForApproval)
        //                };
        //    return Ok(query);
        //}
    }
}
