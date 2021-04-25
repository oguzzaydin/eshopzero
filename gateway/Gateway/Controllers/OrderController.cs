using System;
using System.Net;
using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Controllers
{
    [Authorize]
    [ApiController]
    //[ApiVersion("1.o")]
    [Route("api/v{version:apiVersion}/orders")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    public class OrderController : ControllerBase
    {
        [HttpGet(Name = "GetForm")]
        //[MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ResponseCache(Duration = 100)]
        public ActionResult<string> Get()
        {
            return Ok(Guid.NewGuid());
        }
    }
}