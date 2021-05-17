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
                Message = message,
                StatusCode = statusCode
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
            var user = await _dbContext.Users.Where(a => a.Id == id).FirstOrDefaultAsync();

            if (user == null) return BadRequest();

            var result = new UserResponseModel
            {
                Id = user.Id,
                StaffCode = user.StaffCode,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = GetGender(user.Gender),
                DoB = user.DoB,
                JoinedDate = user.JoinedDate,
                Location = user.Location
            };

            return Ok(new Response<UserResponseModel>
            {
                Data = result,
                StatusCode = 200,
            });
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

            var response = PaginationHelper.CreatePagedResponse(result, filter.PageNumber, filter.PageSize, count, (int)HttpStatusCode.OK);
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
                if (userValidation.StatusCode == 422) return StatusCode(422, userValidation);

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

                if (!await _roleManager.RoleExistsAsync(RoleName.User))
                {
                    await _roleManager.CreateAsync(new ApplicationRole(RoleName.User));
                }
                await _userManager.AddToRoleAsync(user, RoleName.User);

                user.StaffCode = AutoGenerateStaffCode(user.Id);
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();

                return Ok(new UserModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DoB = user.DoB,
                    Gender = user.Gender,
                    Location = user.Location,
                    StaffCode = user.StaffCode,
                    JoinedDate = user.JoinedDate
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPut("{id}")]
        public IActionResult EditUser(int id, UpdateUserModel model)
        {
            var user = _dbContext.Users.SingleOrDefault(u => u.Id == id);

            if (user == null) return BadRequest("Cannot find this user!");

            //var userValidation = UserValidation(model);

            //if (userValidation.StatusCode == 422)
            //{
            //    return StatusCode(422, userValidation);
            //}

            user.DoB = model.DoB;
            user.JoinedDate = model.JoinedDate;
            user.Gender = model.Gender;

            _dbContext.Users.Update(user);
            _dbContext.SaveChanges();

            return StatusCode(200);
        }


    }
}
