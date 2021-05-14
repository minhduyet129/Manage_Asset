using RookieOnlineAssetManagement.Enums;
using System;

namespace RookieOnlineAssetManagement.Models
{
    public class UserModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DoB { get; set; }
        public DateTime JoinedDate { get; set; }
        public Gender Gender { get; set; }
        public string Location { get; set; }
        public int Id { get; set; }
        public string StaffCode { get; set; }
    }
}
