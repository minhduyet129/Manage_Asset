using Microsoft.AspNetCore.Identity;
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

        private readonly UserManager<ApplicationUser> _userManager;

        public AssignmentController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
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

        private Response<AssignmentResponseModel> ValidateAssignment(AssignmentModel model)
        {
            var asset = _dbContext.Assets.SingleOrDefault(a => a.Id == model.AssetId);
            var assignTo = _userManager.Users.SingleOrDefault(u => u.Id == model.AssignToId && u.State == UserState.Enable);
            var assignBy = _userManager.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).SingleOrDefault(u => u.Id == model.AssignById);
            var checkAdminRole = assignBy.UserRoles.FirstOrDefault().Role.Name == RoleName.Admin;

            var error = new List<object> { };

            if(model.AssignToId <= 0)
            {
                error.Add(new { assignTo = "The field is required" });
            }    
            else if (assignTo == null)
            {
                error.Add(new { assignTo = "The user does not exist" });
            }    
            
            if (model.AssignById <= 0)
            {
                error.Add(new { assignBy = "The field is required" });
            }
            else if (!checkAdminRole)
            {
                error.Add(new { assignBy = "The admin does not exist" });
            }

            if (model.AssetId <= 0)
            {
                error.Add(new { assetId = "The field is required" });
            }
            else if (asset == null)
            {
                error.Add(new { assetId = "The asset does not exist" });
            }
            else if (asset.State != AssetState.Available)
            {
                error.Add(new { assetId = "The asset is not available" });
            }

            if (model.AssignedDate < DateTime.Now)
            {
                error.Add(new { assignedDate = "The assigned date is only current or future date" });
            }

            if (model.Note.Length >= 255)
            {
                error.Add(new { note = "The note has max length is 255 characters" });
            }

            var response = new Response<AssignmentResponseModel>
            {
                Data = null,
                Errors = error
            };

            return response;
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
                if (ValidateAssignment(model).Errors.Count > 0) return BadRequest(ValidateAssignment(model));

                var asset = await _dbContext.Assets.SingleOrDefaultAsync(a => a.Id == model.AssetId);

                var assignment = new Assignment
                {
                    AssignToId = model.AssignToId,
                    AssignById = model.AssignById,
                    AssetId = model.AssetId,
                    AssignedDate = model.AssignedDate,
                    Note = model.Note,
                    State = AssignmentState.Waiting
                };

                var result = await _dbContext.Assignments.AddAsync(assignment);
                asset.State = AssetState.Assigned;
                await _dbContext.SaveChangesAsync();

                return Ok(new AssignmentResponseModel
                { 
                    AssetCode = assignment.Asset.AssetCode,
                    AssetName = assignment.Asset.AssetName,
                    AssignBy = assignment.AssignBy.UserName,
                    AssignTo = assignment.AssignTo.UserName,
                    AssignDate = assignment.AssignedDate,
                    State = GetAssignmentState(assignment.State),
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}
