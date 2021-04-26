using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mime;
using System.Threading.Tasks;
using Gateway.Models;
using Gateway.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/orders")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;

        public OrderController(IOrderService orderService, IProductService productService)
        {
            _orderService = orderService;
            _productService = productService;
        }

        [HttpGet(Name = "GetOrders")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ResponseCache(Duration = 100)]
        public async Task<OkObjectResult> GetOrders()
        {
            var orders = await _orderService.GetOrders();

            foreach (var order in orders)
            {
                foreach (var orderItem in order.OrderItems)
                {
                    var product = await _productService.GetProduct(orderItem.ProductId);
                    orderItem.Product = product;
                }
            }

            return Ok(orders);
        }
    }
}