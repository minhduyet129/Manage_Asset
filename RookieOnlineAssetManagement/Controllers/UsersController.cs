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
            int statusCode = 0;
            string message = null;

            if (DateTime.Now.ToString() == "")
            {
                statusCode = 422;
                error.Add(new { joinedDate = "The field is required" });
            }
            else if (DateTime.Now.Year - model.DoB.Year < 18)
            {
                statusCode = 422;
                error.Add(new { doB = "User is under 18. Please select a different date" });
            }

            if (model.JoinedDate.ToString() == "")
            {
                statusCode = 422;
                error.Add(new { joinedDate = "The field is required" });
            }
            else if (model.DoB.Year - model.JoinedDate.Year > 0)
            {
                statusCode = 422;
                error.Add(new { joinedDate = "Joined date is not later than Date of Birth. Please select a different date" });
            }
            else if (model.JoinedDate.DayOfWeek == DayOfWeek.Saturday || model.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                statusCode = 422;
                error.Add(new { joinedDate = "Joined date is Saturday or Sunday. Please select a different date" });
            }

            else message = "Invalid information";

            var response = new Response<UserResponseModel>
            {
                Data = null,
                Errors = error,
                Message = message
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

        private string GetRoleType(int role)
        {
            if (role == 0)
            {
                return RoleName.Admin;
            } 
            else
            {
                return RoleName.User;
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _dbContext.Users.Where(a => a.Id == id).SingleOrDefaultAsync();

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
                UserName = user.UserName
            };

            return Ok(new Response<UserResponseModel>(result));
        }

        [HttpGet]
        public async Task<IActionResult> GetListUser(string location, [FromQuery] PaginationFilter filter)
        {
            var queryable = !string.IsNullOrEmpty(location)
                ? _dbContext.Users.Where(u => u.Location == location)
                : _dbContext.Users;
            var count = await queryable.CountAsync();
            var data = await queryable
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var result = data.Select(user => new UserResponseModel
            {
                Id = user.Id,
                StaffCode = user.StaffCode,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = GetGender(user.Gender),
                DoB = user.DoB,
                JoinedDate = user.JoinedDate,
                Location = user.Location,
                UserName = user.UserName
            }).ToList();

            var response = PaginationHelper.CreatePagedResponse(result, filter.PageNumber, filter.PageSize, count);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            try
            {
                var userName = AutoGenerateUserName(model.FirstName, model.LastName);
                var password = AutoGeneratePassword(userName, model.DoB);

                var userValidation = UserValidation(model);

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

                var roleType = GetRoleType(model.RoleType);

                if (!await _roleManager.RoleExistsAsync(roleType))
                {
                    await _roleManager.CreateAsync(new ApplicationRole(roleType));
                }
                await _userManager.AddToRoleAsync(user, roleType);

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
                    RoleType = GetRoleType(model.RoleType)
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
                var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == id);

                if (user == null) return NotFound("Cannot find this user!");

                user.DoB = model.DoB;
                user.JoinedDate = model.JoinedDate;
                user.Gender = model.Gender;

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
                    UserName = user.UserName
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }

        }

    }
}
