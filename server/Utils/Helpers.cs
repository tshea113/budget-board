using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.Utils;

public static class Helpers
{
    public static IActionResult BuildErrorResponse(ILogger logger, string message)
    {
        logger.LogError(message);

        var errorObjectResult = new ObjectResult("There was an internal server error.");
        errorObjectResult.StatusCode = StatusCodes.Status500InternalServerError;

        return errorObjectResult;
    }
}
