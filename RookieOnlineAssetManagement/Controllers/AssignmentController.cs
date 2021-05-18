using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enums;
using RookieOnlineAssetManagement.Filter;
using RookieOnlineAssetManagement.Helper;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public AssignmentController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private string GetAssignmentState(AssignmentState state)
        {
            if (state == AssignmentState.Waiting)
            {
                return "Waiting for acceptance";
            } 
            else if (state == AssignmentState.Accepted)
            {
                return "Accepted";
            }    
            else
            {
                return "Declined";
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssignment([FromQuery] PaginationFilter filter)
        {
            var queryable = _dbContext.Assignments
                .Include(a => a.Asset)
                .Include(a => a.AssignTo)
                .Include(a => a.AssignBy);
            var count = await queryable.CountAsync();
            var data = await queryable
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var result = data.Select(assignment => new AssignmentResponseModel
            {
                AssetCode = assignment.Asset.AssetCode,
                AssetName = assignment.Asset.AssetName,
                AssignTo = assignment.AssignTo.UserName,
                AssignBy = assignment.AssignBy.UserName,
                AssignDate = assignment.AssignedDate,
                State = GetAssignmentState(assignment.State)
            }).ToList();


            var response = PaginationHelper.CreatePagedResponse(result, filter.PageNumber, filter.PageSize, count);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(AssignmentModel model)
        {
            try
            {


                var user = new Assignment
                {
                    AssignToId = model.AssignToId,
                    AssignById = model.AssignById,
                    AssetId = model.AssetId,
                    AssignedDate = model.AssignedDate,
                    Note = model.Note,
                    State = AssignmentState.Waiting
                };

                var result = await _dbContext.Assignments.AddAsync(user);
                if (result == null) return BadRequest("Something was wrong");
                await _dbContext.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}
