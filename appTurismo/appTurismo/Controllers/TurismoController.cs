using System;
using System.Collections.Generic;
using System.Web.Mvc;
using appTurismo.Filtros;
using System.Linq;
using System.Configuration;
using System.Threading.Tasks;
using General.Librerias.AccesoDatos;


namespace appTurismo.Controllers
{
    public class TurismoController : Controller
    {
        public ActionResult Login()
        {
            ViewBag.Token = Guid.NewGuid();
            return View();
        }
        
        [FiltrosController.FiltroAutenticacion]
        public ActionResult Registro()
        {
            return View();
        }
        public async Task<string> validarLogin(string usuario, string clave, string codigo)
        {
            string rpta = "";
            string token = Request.Headers["token"];
            if (!string.IsNullOrEmpty(token))
            {
                if (!string.IsNullOrEmpty(usuario) && !string.IsNullOrEmpty(clave))
                {
                    var odaSql = new accesodatos("conexionsql");
                    string[] login = new string[2];
                    login[0] = usuario;  
                    login[1] = clave;
                    login[2] = token;
                    rpta = odaSql.EjecutarComandoPosgresql("usploginapp", login);
                    if (!string.IsNullOrEmpty(rpta))
                    {
                        Session["Usuario"] = usuario;
                        rpta = "Bienvenido al Sistema";
                    }
                }
                else
                {
                    rpta = "Error^Debe ingresar el usuario y/o password.";
                }
            }
            else rpta = "Error - No existe el Token";
            return rpta;
        }
    }
}