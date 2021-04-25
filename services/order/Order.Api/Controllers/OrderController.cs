using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace Order.Api.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.o")]
    [Route("api/v{version:apiVersion}/orders")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    //[ProducesResponseType(typeof(InternalServerErrorObjectResult), (int)HttpStatusCode.BadRequest)]
    public class OrderController : ControllerBase
    {

    }
}