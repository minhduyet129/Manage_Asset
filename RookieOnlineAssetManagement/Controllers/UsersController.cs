using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
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

        public string AutoGenerateUserName(string firstName, string lastName)
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

        public string AutoGenerateStaffCode(int id)
        {
            var code = "SD" + id.ToString("d4");
            return code;
        }

        public string AutoGeneratePassword(string userName, DateTime dob)
        {
            string dateTime = dob.ToString("ddMMyyyy");
            string password = userName + "@" + dateTime;
            return password;
        }

        public UserResponse UserValidation(UserModel model)
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

            if (error.Count() == 0)
            {
                statusCode = 201;
                message = "Created user successfully";
            }
            else message = "Created fail";

            var response = new UserResponse
            {
                StatusCode = statusCode,
                Error = error,
                Message = message
            };
            return response;
        }

        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user = _dbContext.Users.SingleOrDefault(x => x.Id == id);

            if (user != null)
            {
                return Ok(user);
            }

            return BadRequest();
        }

        [HttpGet()]
        public async Task<ActionResult> GetListUser(string location)
        {
            var users = await _dbContext.Users.Where(u => u.Location == location).ToListAsync();

            var result = new List<UserModel>();

            foreach(var user in users)
            {
                result.Add(new UserModel
                {
                    Id = user.Id,
                    StaffCode = user.StaffCode,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Gender = user.Gender,
                    DoB = user.DoB,
                    JoinedDate = user.JoinedDate,
                    Location = user.Location
                });
            } 

            return Ok(result);
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

        [HttpPost("test")]
        public IActionResult Test(UserModel model)
        {
            return Ok(UserValidation(model));
        }
    }
}
