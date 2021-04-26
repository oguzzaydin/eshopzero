using System;
using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Order.Api.Application.Commands;
using Order.Api.Application.Queries;
using Zero.EventBus.Extensions;

namespace Order.Api.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.o")]
    [Route("api/v{version:apiVersion}/orders")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(InternalServerErrorObjectResult), (int)HttpStatusCode.InternalServerError)]
    public class OrderController : ControllerBase
    {
        private readonly ILogger<OrderController> _logger;
        private readonly IMediator _mediator;
        private readonly IOrderQuery _orderQuery;

        public OrderController(ILogger<OrderController> logger, IMediator mediator, IOrderQuery orderQuery)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger)); ;
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _orderQuery = orderQuery ?? throw new ArgumentNullException(nameof(orderQuery)); ;
            ;
        }

        [HttpGet(Name = "GetOrders")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(IEnumerable<OrderModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<OrderModel>>> Get() =>
            Ok(await _orderQuery.GetOrdersAsync());

        [HttpPost(Name = "CreateOrderCommandHandler")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(bool), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<bool>> Create([FromBody] CreateOrderCommand command)
        {
            _logger.LogInformation(
                "----- Sending command: {CommandName} - {NameProperty} ({@Command})",
                command.GetGenericTypeName(),
                nameof(command.Items), command);

            var commandResult = await _mediator.Send(command);

            if (!commandResult)
            {
                return BadRequest();
            }

            return Ok();
        }

     
    }
}