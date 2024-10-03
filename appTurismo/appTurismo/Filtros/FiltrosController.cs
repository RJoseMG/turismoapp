using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace appTurismo.Filtros
{
    public class FiltrosController : Controller
    {
        public class FiltroAutenticacion : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                if (filterContext.HttpContext.Session["Usuario"] == null)
                {
                    filterContext.Result = new RedirectResult("~/Turismo/Login");
                }
            }
        }

    }
}