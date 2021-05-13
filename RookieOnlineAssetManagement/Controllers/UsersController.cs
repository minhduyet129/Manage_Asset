using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
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

        public UsersController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public string AutoGenerateUserName(string firstName, string lastName)
        {
            string userName = firstName.ToLower();
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

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            string userName = AutoGenerateUserName(model.FirstName, model.LastName);
            string password = AutoGeneratePassword(userName, model.DoB);

            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                DoB = model.DoB,
                JoinedDate = model.JoinedDate,
                Gender = model.Gender,
                Location = model.Location,
                UserName = userName,
                Password = password,
            };

            var result = await _dbContext.Users.AddAsync(user);
            _dbContext.SaveChanges();

            var staffCode = AutoGenerateStaffCode(result.Entity.Id);

            var currentUser = _dbContext.Users.SingleOrDefault(x => x.Id == result.Entity.Id);

            currentUser.StaffCode = staffCode;
            _dbContext.Users.Update(currentUser);
            _dbContext.SaveChanges();
            return Ok(password);
        }

        //[HttpPut]
        //public IActionResult UpdateStaffCode(int id)
        //{

        //}
    }
}
