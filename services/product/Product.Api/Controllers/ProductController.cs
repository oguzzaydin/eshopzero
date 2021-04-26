using System.Net;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Product.Api.Application.Queries;
using Product.Api.Web.Filters;

namespace Product.Api.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.o")]
    [Route("api/v{version:apiVersion}/products")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(InternalServerErrorObjectResult), (int)HttpStatusCode.InternalServerError)]
    public class ProductController : ControllerBase
    {
        private readonly IProductQuery _productQuery;

        public ProductController(IProductQuery productQuery)
        {
            _productQuery = productQuery;
        }

        [HttpGet("{id:int}", Name = "GetProduct")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(ProductModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<ProductModel>> Product(int id) =>
            Ok(await _productQuery.GetProductAsync(id));
    }
}