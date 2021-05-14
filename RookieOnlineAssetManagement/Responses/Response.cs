using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Responses
{
    public class Response<T>
    {
        public Response()
        {
        }
        public Response(T data)
        {
            Message = string.Empty;
            Errors = null;
            Data = data;
            StatusCode = 0;
        }
        public T Data { get; set; }
        public List<object> Errors { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
    }
}
