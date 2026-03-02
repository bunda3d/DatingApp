using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ErrorHandlerController : BaseApiController
{
    // 401 - unauthorized
    [HttpGet("auth")]
    public IActionResult GetAuth()
    {
        return Unauthorized();
    }

    // 404 - not found
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    // 500 - server error (stack trace returned as JSON by custom middleware)
    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("Server error");
    }

    // 400 - bad request
    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("Bad request");
    }
}

