using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("error/{code}")]
    [ApiExplorerSettings(IgnoreApi=true)] // remove controller from swagger
    public class ErrorController  :BaseApiController
    {
        public IActionResult Error (int code)
        {
            return new ObjectResult(new ApiResponse(code));
        }

    }
}