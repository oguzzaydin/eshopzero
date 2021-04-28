using FluentValidation;
using Microsoft.Extensions.Logging;
using Order.Api.Application.Commands;

namespace Order.Api.Application.Validations
{
    public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator(ILogger<CreateOrderCommand> logger)
        {
            RuleFor(order => order.Items).NotNull().NotEmpty();

            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }

    public class OrderITemModelValidator : AbstractValidator<OrderItemModel>
    {
        public OrderITemModelValidator(ILogger<CreateOrderCommand> logger)
        {
            RuleFor(item => item.ProductId).NotNull().NotEmpty();
            RuleFor(item => item.Quantity).Must((item, _) => item.Quantity > 0).NotNull().NotEmpty();

            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}