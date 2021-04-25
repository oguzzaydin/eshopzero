using System;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Product.Api.Domain.Exceptions;
using ValidationException = FluentValidation.ValidationException;

namespace Product.Api.Web.Filters
{
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<HttpGlobalExceptionFilter> _logger;

        public HttpGlobalExceptionFilter(IWebHostEnvironment env, ILogger<HttpGlobalExceptionFilter> logger)
        {
            _env = env;
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            _logger.LogError(new EventId(context.Exception.HResult),
                context.Exception,
                context.Exception.Message);

            if (context.Exception.GetType() == typeof(ProductDomainException))
            {
                var problemDetails = new ValidationProblemDetails
                {
                    Instance = context.HttpContext.Request.Path,
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Please refer to the errors property for additional details."
                };
                if (context.Exception.InnerException?.GetType() == typeof(ValidationException))
                    problemDetails.Errors.Add("DomainValidations", ((ValidationException)context.Exception.InnerException).Errors.Select(x => x.ErrorMessage).ToArray());

                context.Result = new BadRequestObjectResult(problemDetails);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else
            {
                var json = new JsonErrorResponse
                {
                    Errors = new[] {
                        new Error
                        {
                            Message = context.Exception.Message,
                            Code = context.Exception.Data["Code"]?.ToString(),
                            DeveloperMessage = _env.IsDevelopment() ? context.Exception : null
                        },
                        new Error
                        {
                            Message = context.Exception.InnerException?.Message,
                            Code = context.Exception.InnerException?.Data["Code"]?.ToString(),
                            DeveloperMessage = _env.IsDevelopment() ? context.Exception.InnerException : null
                        }
                    }
                };

                context.Result = new InternalServerErrorObjectResult(json);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
            context.ExceptionHandled = true;
        }

    }


    public class JsonErrorResponse
    {
        public Error[] Errors { get; set; }
    }

    public class Error
    {
        public string Code { get; set; }
        public string Message { get; set; }
        public object DeveloperMessage { get; set; }
    }
    public class InternalServerErrorObjectResult : ObjectResult
    {
        public InternalServerErrorObjectResult(object error)
            : base(error)
        {
            StatusCode = StatusCodes.Status500InternalServerError;
        }
    }
}