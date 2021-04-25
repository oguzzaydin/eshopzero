using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Zero.Core.Repositories.EntityFramework;
using Zero.EventBus.Extensions;

namespace Product.Api.Infrastructure
{
    public class ProductUow : EntityFrameworkUowBase
    {
        private readonly DbContext _context;
        private readonly IMediator _mediator;

        public ProductUow(DbContext context, IMediator mediator) : base(context)
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