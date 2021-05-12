using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public DateTime AssignedDate { get; set; }
        public AssignmentState State { get; set; }
        public string Note { get; set; }

        public Asset Asset { get; set; }
        public ReturnRequest ReturnRequest { get; set; }
        public ICollection<UsersOfAssignment> UsersOfAssignments { get; set; }
    }
}
