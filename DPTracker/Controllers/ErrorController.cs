using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DPTracker.Controllers
{
    [Route("api/Error"), AllowAnonymous, ApiController]
    public class ErrorController : ControllerBase
    {
        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [Route("500")]
        public IActionResult Error500()
        {
            var ex = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            object? result = null;
            if (ex != null && exceptionFeature != null)
            {
                _logger.LogError(ex.Error, "Error in {path}", exceptionFeature.Path);
                result = new
                {
                    ErrorMessage = exceptionFeature.Error.Message,
                    RouteOfException = exceptionFeature.Path
                };
            }

            return StatusCode(500, result);
        }

        [Route("{statusCode}")]
        public IActionResult HandleErrorCode(int statusCode)
        {
            var statusCodeData = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            object? result = null;
            if (statusCodeData == null)
            {
                return StatusCode(statusCode);
            }
            switch (statusCode)
            {
                case 404:
                    result = new
                    {
                        ErrorMessage = "Sorry the page you requested could not be found",
                        RouteOfException = statusCodeData.OriginalPath
                    };
                    break;
                case 500:
                    _logger.LogWarning("Error 500 in {path}", statusCodeData.OriginalPath);
                    result = new
                    {
                        ErrorMessage = "Sorry something went wrong on the server",
                        RouteOfException = statusCodeData.OriginalPath
                    };
                    break;
            }

            return StatusCode(statusCode, result);
        }
    }
}
