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

    public static HostString GetHostString(HttpRequest request)
    {
        var host = GetHost(request);
        var port = GetPort(request);

        if (port == -1)
        {
            return new HostString(host);
        }
        else
        {
            return new HostString(host, port);
        }
    }

    public static string GetHost(HttpRequest request)
    {
        return request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? request.Host.ToString();
    }

    public static int GetPort(HttpRequest request)
    {
        var portString = request.Headers["X-Forwarded-Port"].FirstOrDefault() ?? "-1";
        return int.Parse(portString);
    }

    public static string GetProto(HttpRequest request)
    {
        return request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? request.Protocol;
    }
}
