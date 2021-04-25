using Microsoft.AspNetCore.Mvc;

namespace Gateway.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return new RedirectResult("~/swagger");
        }
    }
}