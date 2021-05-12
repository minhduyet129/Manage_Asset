using RookieOnlineAssetManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Entities
{
    public class ReturnRequest
    {
        public int Id { get; set; }
        public DateTime AssignedDate { get; set; }
        public int ApplicationUserId { get; set; }
        public DateTime ReturnedDate { get; set; }
        public ReturnRequestState State { get; set; }
        public int AssignmentId { get; set; }

        public ApplicationUser ApplicationUser { get; set; }
        public Assignment Assignment { get; set; }
    }
}
