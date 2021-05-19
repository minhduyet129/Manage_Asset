using Microsoft.AspNetCore.Identity;
using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Entities
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string StaffCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DoB { get; set; }
        public DateTime JoinedDate { get; set; }
        public Gender Gender { get; set; }
        public string Location { get; set; }
        public string Password { get; set; }

        public ICollection<ReturnRequest> ReturnRequests { get; set; }
        public virtual ICollection<Assignment> AssignmentsTo { get; set; }
        public virtual ICollection<Assignment> AssignmentsBy { get; set; }
    }
}
