using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Entities
{
    public class UsersOfAssignment
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public int ApplicationUserId { get; set; }

        public Assignment Assignment { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
