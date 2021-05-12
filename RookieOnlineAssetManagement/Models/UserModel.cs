using RookieOnlineAssetManagement.Enums;
using System;

namespace RookieOnlineAssetManagement.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public string StaffCode { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DoB { get; set; }
        public DateTime JoinedDate { get; set; }
        public Gender Gender { get; set; }
        public Role Role { get; set; }
        public string Location { get; set; }
    }
}
