using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ReturnsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReturnsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
    }
}
