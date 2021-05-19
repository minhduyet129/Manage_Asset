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
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly RoleManager<ApplicationRole> _roleManager;

        public UsersController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        private string AutoGenerateUserName(string firstName, string lastName)
        {
            string userName = firstName;
            var parts = lastName.Split(" ").ToList();

            foreach (var part in parts)
            {
                userName += part.Substring(0, 1).ToLower();
            }

            var count = _dbContext.Users.Count(u => u.UserName.StartsWith(userName));

            if (count > 0)
            {
                userName += count.ToString();
            }

            return userName;
        }

        private string AutoGenerateStaffCode(int id)
        {
            var code = "SD" + id.ToString("d4");
            return code;
        }

        private string AutoGeneratePassword(string userName, DateTime dob)
        {
            var dateTime = dob.ToString("ddMMyyyy");
            var password = userName + "@" + dateTime;

            // Check if password contains at least one upper character
            if (!Regex.IsMatch(password, "(?=.*[A-Z])"))
            {
                password = char.ToUpper(password[0]) + password.Substring(1);
            }

            return password;
        }

        private Response<UserResponseModel> UserValidation(UserModel model)
        {
            var error = new List<object> { };

            if (model.FirstName == string.Empty)
            {
                error.Add(new { firstName = "The first name is required" });
            }

            if (model.LastName == string.Empty)
            {
                error.Add(new { firstName = "The last name is required" });
            }

            if (DateTime.Now.Year - model.DoB.Year < 18)
            {
                error.Add(new { doB = "User is under 18. Please select a different date" });
            }

            if (model.DoB.Year - model.JoinedDate.Year > 0)
            {
                error.Add(new { joinedDate = "Joined date is not later than Date of Birth. Please select a different date" });
            }
            else if (model.JoinedDate.DayOfWeek == DayOfWeek.Saturday || model.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                error.Add(new { joinedDate = "Joined date is Saturday or Sunday. Please select a different date" });
            }

            if (model.RoleType == string.Empty)
            {
                error.Add(new { RoleType = "The role field is required" });
            }    
            else if (model.RoleType != RoleName.Admin && model.RoleType != RoleName.User)
            {
                error.Add(new { RoleType = "The role is not found" });
            }    

            var response = new Response<UserResponseModel>
            {
                Data = null,
                Errors = error
            };

            return response;
        }

        private Response<UserResponseModel> UpdateUserValidation(UpdateUserModel model)
        {
            var error = new List<object> { };

            if (DateTime.Now.Year - model.DoB.Year < 18)
            {
                error.Add(new { doB = "User is under 18. Please select a different date" });
            }

            if (model.DoB.Year - model.JoinedDate.Year > 0)
            {
                error.Add(new { joinedDate = "Joined date is not later than Date of Birth. Please select a different date" });
            }
            else if (model.JoinedDate.DayOfWeek == DayOfWeek.Saturday || model.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                error.Add(new { joinedDate = "Joined date is Saturday or Sunday. Please select a different date" });
            }

            if (model.RoleType != RoleName.Admin && model.RoleType != RoleName.User)
            {
                error.Add(new { RoleType = "The role is not found" });
            }

            var response = new Response<UserResponseModel>
            {
                Data = null,
                Errors = error
            };

            return response;
        }

        private string GetGender(Gender gender)
        {
            if (gender == Gender.Female)
            {
                return "Female";
            }
            return "Male";
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound("Cannot find this user!");

            var result = new UserResponseModel
            {
                Id = user.Id,
                StaffCode = user.StaffCode,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = GetGender(user.Gender),
                DoB = user.DoB,
                JoinedDate = user.JoinedDate,
                Location = user.Location,
                UserName = user.UserName,
                RoleType = await _userManager.GetRolesAsync(user)
            };

            return Ok(new Response<UserResponseModel>(result));
        }

        [HttpGet]
        public async Task<IActionResult> GetListUser(string location, [FromQuery] PaginationFilter filter)
        {
            var queryable = !string.IsNullOrEmpty(location)
                ? _userManager.Users.Where(u => u.Location == location)
                : _userManager.Users;
            var count = await queryable.CountAsync();
            var data = await queryable
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var result = new List<UserResponseModel>();

            foreach (var user in data)
            {
                var roleType = await _userManager.GetRolesAsync(user);

                result.Add(new UserResponseModel
                {
                    Id = user.Id,
                    StaffCode = user.StaffCode,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Gender = GetGender(user.Gender),
                    DoB = user.DoB,
                    JoinedDate = user.JoinedDate,
                    Location = user.Location,
                    UserName = user.UserName,
                    RoleType = roleType
                });
            }

            var response = PaginationHelper.CreatePagedResponse(result, filter.PageNumber, filter.PageSize, count);
            return Ok(response);
        }

        [HttpGet("roles")]
        public IActionResult GetRoleList()
        {
            return Ok(_roleManager.Roles);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            try
            {
                var userValidation = UserValidation(model);
                if (userValidation.Errors.Count > 0) return BadRequest(userValidation);

                var userName = AutoGenerateUserName(model.FirstName, model.LastName);
                var password = AutoGeneratePassword(userName, model.DoB);

                var user = new ApplicationUser
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    DoB = model.DoB,
                    JoinedDate = model.JoinedDate,
                    Gender = model.Gender,
                    Location = model.Location,
                    UserName = userName,
                    Password = password
                };

                var result = await _userManager.CreateAsync(user, password);
                if (result == null) return BadRequest("Something was wrong");
                if (result.Errors.Any()) return BadRequest(result.Errors);

                if (!await _roleManager.RoleExistsAsync(model.RoleType))
                {
                    await _roleManager.CreateAsync(new ApplicationRole(model.RoleType));
                }
                await _userManager.AddToRoleAsync(user, model.RoleType);

                user.StaffCode = AutoGenerateStaffCode(user.Id);
                await _dbContext.SaveChangesAsync();

                return Ok(new UserResponseModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DoB = user.DoB,
                    Gender = GetGender(user.Gender),
                    Location = user.Location,
                    StaffCode = user.StaffCode,
                    JoinedDate = user.JoinedDate,
                    UserName = user.UserName,
                    RoleType = await _userManager.GetRolesAsync(user)
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(int id, UpdateUserModel model)
        {
            try
            {
                var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == id);

                if (user == null) return NotFound("Cannot find this user!");

                var userValidation = UpdateUserValidation(model);
                if (userValidation.Errors.Count > 0) return BadRequest(userValidation);

                var oldUserRole = await _userManager.GetRolesAsync(user);
                if (oldUserRole.FirstOrDefault() != model.RoleType)
                {
                    await _userManager.RemoveFromRolesAsync(user, oldUserRole);
                    await _userManager.AddToRoleAsync(user, model.RoleType);
                }    

                user.DoB = model.DoB;
                user.JoinedDate = model.JoinedDate;
                user.Gender = model.Gender;
                await _dbContext.SaveChangesAsync();

                var newUserRole = await _userManager.GetRolesAsync(user);

                return Ok(new UserResponseModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DoB = user.DoB,
                    Gender = GetGender(user.Gender),
                    Location = user.Location,
                    StaffCode = user.StaffCode,
                    JoinedDate = user.JoinedDate,
                    UserName = user.UserName,
                    RoleType = newUserRole
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DisableUser(int id)
        {
            var errors = new List<object>();
            var user = await _dbContext.Users.Include(u => u.AssignmentsTo).SingleOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                errors.Add(new
                {
                    message = "The user is not exist"
                });

                return BadRequest(new Response<UserResponseModel> { Errors = errors });
            } 
                

            if (user.AssignmentsTo.Count > 0)
            {
                errors.Add(new 
                { 
                    message = "There are valid assignments belonging to this user. Please close all assignments before disabling user." 
                });

                return BadRequest(new Response<UserResponseModel> { Errors = errors });
            }

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
