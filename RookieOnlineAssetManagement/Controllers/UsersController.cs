using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
            string dateTime = dob.ToString("ddMMyyyy");
            string password = userName + "@" + dateTime;
            return password;
        }

        private Response<UserResponseModel> UserValidation(UserModel model)
        {
            var error = new List<object> { };
            int statusCode = 0;
            string message = null;

            if (DateTime.Now.Year - model.DoB.Year < 18)
            {
                statusCode = 422;
                error.Add(new { doB = "User is under 18. Please select a different date" });
            }

            if (model.DoB.Year - model.JoinedDate.Year > 0)
            {
                statusCode = 422;
                error.Add(new { joinedDate = "Joined date is not later than Date of Birth. Please select a different date" });
            }

            if (model.JoinedDate.DayOfWeek == DayOfWeek.Saturday || model.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                statusCode = 422;
                error.Add(new { joinedDate = "Joined date is Saturday or Sunday. Please select a different date" });
            }

            else message = "Created fail";

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
            var users = await _dbContext.Users.Where(u => u.Location == location).ToListAsync();

            if (users == null) return BadRequest();

            var result = new List<UserResponseModel>();

            foreach (var user in users)
            {
                result.Add(new UserResponseModel
                {
                    Id = user.Id,
                    StaffCode = user.StaffCode,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Gender = GetGender(user.Gender),
                    DoB = user.DoB,
                    JoinedDate = user.JoinedDate,
                    Location = user.Location
                });
            }

            var validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);

            var pagedData = result
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize).ToList();

            var totalRecords = await _dbContext.Users.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse<UserResponseModel>(pagedData, validFilter, totalRecords, 200);

            return Ok(pagedReponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            string userName = AutoGenerateUserName(model.FirstName, model.LastName);
            string password = AutoGeneratePassword(userName, model.DoB);

            var userValidation = UserValidation(model);

            if (userValidation.StatusCode == 422)
            {
                return StatusCode(422, userValidation);
            }

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

            if (!await _roleManager.RoleExistsAsync(RoleName.User))
            {
                await _roleManager.CreateAsync(new ApplicationRole(RoleName.User));
            }
            await _userManager.AddToRoleAsync(user, RoleName.User);

            var staffCode = AutoGenerateStaffCode(user.Id);

            var currentUser = _dbContext.Users.Find(user.Id);

            currentUser.StaffCode = staffCode;
            _dbContext.Users.Update(currentUser);
            _dbContext.SaveChanges();

            return StatusCode(userValidation.StatusCode, userValidation);
        }
    }
}
