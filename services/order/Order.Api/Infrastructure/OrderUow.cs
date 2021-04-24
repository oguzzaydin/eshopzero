using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Zero.Core.Repositories.EntityFramework;
using Zero.EventBus.Extensions;

namespace Order.Api.Infrastructure
{
    public class OrderUow : EntityFrameworkUowBase
    {
        private readonly DbContext _context;
        private readonly IMediator _mediator;

        public OrderUow(DbContext context, IMediator mediator) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        public override async Task<bool> SaveAsync(CancellationToken cancellationToken = default)
        {
            await _mediator.DispatchDomainEventsAsync(_context);
            return await base.SaveAsync(cancellationToken);
        }
    }
}