using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Responses
{
    public class AssignmentResponseModel
    {
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string AssignTo { get; set; }
        public string AssignBy { get; set; }
        public DateTime AssignDate { get; set; }
        public string State { get; set; }
    }
}
