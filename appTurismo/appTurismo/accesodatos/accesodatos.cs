using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using Npgsql;

namespace appTurismo
{
    public class accesodatos
    {
        readonly string _cadenaConexionPosgrel = "";
        private readonly NpgsqlConnection _conexion = new NpgsqlConnection();
        public accesodatos(string NombreConexion)
        {
            string coneccstring = ConfigurationManager.AppSettings.Get(NombreConexion);
            _cadenaConexionPosgrel = coneccstring;
        }
        public string EjecutarComandoPosgresql(string nombreSp, string[] parametroValor)
        {
            string rpta = "";
            _conexion.ConnectionString = _cadenaConexionPosgrel;
            using (var con = new NpgsqlConnection(_cadenaConexionPosgrel))
            {
                try
                {
                    con.Open();
                    var cmd = new NpgsqlCommand(nombreSp, con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue(parametroValor);
                    object data = cmd.ExecuteScalar();
                    if (data != null)
                        rpta = data.ToString();
                }
                catch (Exception ex)
                {
                    ex.ToString();
                }
            }

            return rpta;
        }
    }
}