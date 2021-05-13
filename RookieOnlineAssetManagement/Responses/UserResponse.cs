using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Responses
{
    public class UserResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public List<object> Error { get; set; }
    }
}
