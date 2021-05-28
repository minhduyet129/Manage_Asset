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
    public class AssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly UserManager<ApplicationUser> _userManager;

        public AssignmentsController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
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

            if (model.AssignedDate < DateTime.Today)
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

        private Response<AssignmentResponseModel> ValidateAssignmentState(AssignmentState state, string message)
        {
            var error = new List<object> { };

            if (state != AssignmentState.Waiting)
            {
                error.Add(new { assignTo = message });
            }

            var response = new Response<AssignmentResponseModel>
            {
                Data = null,
                Errors = error
            };

            return response;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> UpdateAssignment(int id)
        {
            var assignment = await _dbContext.Assignments
                .Include(a => a.Asset)
                .Include(a => a.AssignBy)
                .Include(a => a.AssignTo)
                .SingleOrDefaultAsync(a => a.Id == id);

            return Ok(new AssignmentResponseModel
            {
                Id = assignment.Id,
                AssetCode = assignment.Asset.AssetCode,
                AssetName = assignment.Asset.AssetName,
                AssignTo = assignment.AssignTo.FirstName + " " + assignment.AssignTo.LastName,
                AssignBy = assignment.AssignBy.FirstName + " " + assignment.AssignBy.LastName,
                AssignDate = assignment.AssignedDate,
                State = GetAssignmentState(assignment.State),
                AssetId = assignment.AssetId,
                AssignById = assignment.AssignById,
                AssignToId = assignment.AssignToId,
                Note = assignment.Note,
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssignment(string assignedDate, [FromQuery] PaginationFilter filter, string keyword, int? filterState, string sortBy, bool asc = true)
        {
            IQueryable<Assignment> queryable = _dbContext.Assignments;
            queryable = queryable.Include(a => a.Asset)
                .Include(a => a.AssignBy)
                .Include(a => a.AssignTo);

            if (!string.IsNullOrEmpty(keyword))
            {
                if (!string.IsNullOrEmpty(keyword))
                {
                    queryable = queryable.Where(u => u.Asset.AssetCode.Contains(keyword) 
                        || u.Asset.AssetName.Contains(keyword) 
                        || u.AssignTo.UserName.Contains(keyword));
                }
            }

            if (!string.IsNullOrEmpty(assignedDate))
            {
                DateTime date;
                if (DateTime.TryParseExact(assignedDate, "dd/MM/yyyy",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out date)) 
                { 
                    queryable = queryable.Where(a => a.AssignedDate.Date == date.Date);
                } 
            }

            if (filterState != null && !string.IsNullOrEmpty(filterState.ToString()))
            {
                queryable = queryable.Where(a => a.State == (AssignmentState)filterState);
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "id":
                        queryable = asc ? queryable.OrderBy(u => u.Id) : queryable.OrderByDescending(u => u.Id);
                        break;

                    case "assetCode":
                        queryable = asc ? queryable.OrderBy(u => u.Id) : queryable.OrderByDescending(u => u.Id);
                        break;

                    case "assetName":
                        queryable = asc ? queryable.OrderBy(u => u.Asset.AssetName) : queryable.OrderByDescending(u => u.Asset.AssetName);
                        break;

                    case "assignTo":
                        queryable = asc ? queryable.OrderBy(u => u.AssignTo.UserName) : queryable.OrderByDescending(u => u.AssignTo.UserName);
                        break;

                    case "assignBy":
                        queryable = asc ? queryable.OrderBy(u => u.AssignBy.UserName) : queryable.OrderByDescending(u => u.AssignBy.UserName);
                        break;

                    case "assignDate":
                        queryable = asc ? queryable.OrderBy(u => u.AssignedDate) : queryable.OrderByDescending(u => u.AssignedDate);
                        break;

                    case "state":
                        queryable = asc ? queryable.OrderBy(u => u.State) : queryable.OrderByDescending(u => u.State);
                        break;

                    default:
                        queryable = asc ? queryable.OrderBy(u => u.Id) : queryable.OrderByDescending(u => u.Id);
                        break;
                }
            }

            var count = await queryable.CountAsync();
            var data = await queryable
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var result = data.Select(assignment => new AssignmentResponseModel
            {
                Id = assignment.Id,
                AssetCode = assignment.Asset.AssetCode,
                AssetName = assignment.Asset.AssetName,
                AssignTo = assignment.AssignTo.UserName,
                AssignBy = assignment.AssignBy.UserName,
                AssignDate = assignment.AssignedDate,
                State = GetAssignmentState(assignment.State),
                AssetId = assignment.AssetId,
                AssignById = assignment.AssignById,
                AssignToId = assignment.AssignToId
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
                asset.State = AssetState.WaitingForApproval;
                await _dbContext.SaveChangesAsync();

                return Ok(new AssignmentResponseModel
                {
                    Id = assignment.Id,
                    AssetCode = assignment.Asset.AssetCode,
                    AssetName = assignment.Asset.AssetName,
                    AssignBy = assignment.AssignBy.UserName,
                    AssignTo = assignment.AssignTo.UserName,
                    AssignDate = assignment.AssignedDate,
                    State = GetAssignmentState(assignment.State),
                    AssetId = assignment.AssetId,
                    AssignById = assignment.AssignById,
                    AssignToId = assignment.AssignToId
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignment(int id, AssignmentModel model)
        {
            var assignment = await _dbContext.Assignments.SingleOrDefaultAsync(a => a.Id == id);

            var stateMessage = "Cannot edit because the assignment has been responded by assignee";
            var validateState = ValidateAssignmentState(assignment.State, stateMessage);
            if (validateState.Errors.Count > 0) return BadRequest(validateState.Errors);

            var validate = ValidateAssignment(model);
            if (validate.Errors.Count > 0) return BadRequest(validate.Errors);

            assignment.AssignToId = model.AssignToId;
            assignment.AssignById = model.AssignById;
            assignment.AssetId = model.AssetId;
            assignment.AssignedDate = model.AssignedDate;
            assignment.Note = model.Note;

            await _dbContext.SaveChangesAsync();

            return Ok(new AssignmentResponseModel
            {
                Id = assignment.Id,
                AssetCode = assignment.Asset.AssetCode,
                AssetName = assignment.Asset.AssetName,
                AssignTo = assignment.AssignTo.UserName,
                AssignBy = assignment.AssignBy.UserName,
                AssignDate = assignment.AssignedDate,
                State = GetAssignmentState(assignment.State),
                AssetId = assignment.AssetId,
                AssignById = assignment.AssignById,
                AssignToId = assignment.AssignToId
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _dbContext.Assignments.SingleOrDefaultAsync(a => a.Id == id);

            var stateMessage = "Cannot delete because the assignment has been responded by assignee";
            var validateState = ValidateAssignmentState(assignment.State, stateMessage);
            if (validateState.Errors.Count > 0) return BadRequest(validateState.Errors);

            var asset = await _dbContext.Assets.SingleOrDefaultAsync(a => a.Id == assignment.AssetId);
            asset.State = AssetState.Available;

            _dbContext.Remove(assignment);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
