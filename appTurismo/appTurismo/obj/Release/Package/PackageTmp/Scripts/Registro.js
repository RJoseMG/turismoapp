//#region Variables Globales
var listaUbigeo = [];
var nRegUbigeo = 0;
var mapa;

var totalArchivos;
var contadorArchivos;
var nombreArchivo;
var sizeArchivo;
var totalViajesArchivo;
var contadorViajesArchivo;
var paquete = 1024 * 500;
var grilla;
var matriz = [];
var idProyecto;
var filas;
var fila;
//#endregion

window.onload = function () {
    //Http.get("Proyecto/obtenerListas", mostrarListas);
    iniciarMapa();

    cboDepartamento.onchange = function () {
        listarProvincias();
    }

    cboProvincia.onchange = function () {
        listarDistritos();
    }

    cboDistrito.onchange = function () {
        hdfIdUbigeo.value = cboDepartamento.value + cboProvincia.value + cboDistrito.value;
    }

    btnVerMapa.onclick = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            alert(position.coords.latitude);
        }, Excepciones);
    }

    btnRegistrar.onclick = function () {
        if (Validacion.ValidarRequeridos("R", spnValida)) {
            var data = GUI.ObtenerDatos("G");
            var frm = new FormData();
            frm.append("Data", data);
            Http.post("Proyecto/registrarProyecto", mostrarRegistrar, frm);
        }
    }

    btnNuevo.onclick = function () {
        GUI.LimpiarDatos("R");
        divMapa.innerHTML = "";
        spnValida.innerHTML = "";
        divArchivo.innerHTML = "";
        spnProgresoArchivo.innerHTML = "";
        pbrArchivo.value = 0;
        spnProgresoTotal.innerHTML = "";
        pbrTotal.value = 0;
    }

    btnAbrir.onclick = function () {
        fupArchivo.click();
    }

    fupArchivo.onchange = function () {
        var files = this.files;
        var nfiles = files.length;
        var file;
        var lista = [];
        lista.push("Archivo|Tamanio|Estado");
        lista.push("200|100|100");
        lista.push("String|Int32|String");
        for (var i = 0; i < nfiles; i++) {
            file = files[i];
            lista.push(file.name + "|" + file.size + "|");
        }
        grilla = new GUI.Grilla(divArchivo, lista, "archivo", null, "Total de Archivos: ", null, null, false, null, 1000, 5, false, false, false, false, false);
    }

    btnSubir.onclick = function () {
        iniciarVariablesSubida();
        enviarArchivo();
    }

    

}

function mostrarListas(rpta) {
    if (rpta) {
        var listas = rpta.split("_");
        var listaTipo = [];
        if (listas.length > 0) {
            listaTipo = listas[0].split("¬");
        }
        if (listas.length > 1) {
            listaUbigeo = listas[1].split("¬");
            nRegUbigeo = listaUbigeo.length;
        }
        GUI.Combo(cboTipo, listaTipo, "Seleccione");
        listarDepartamentos();
    }
}

function listarDepartamentos()
{
    var html = "<option value=''>Seleccione</option>";
    var ubigeo, idDpto, idProv, idDist, nombre;
    var campos = [];
    for (var i = 0; i < nRegUbigeo; i++)
    {
        campos = listaUbigeo[i].split('|');
        ubigeo = campos[0];
        idDpto = ubigeo.substr(0, 2);
        idProv = ubigeo.substr(2, 2);
        idDist = ubigeo.substr(4, 2);
        if (idDpto!="00" && idProv=="00" && idDist=="00") {
            nombre = ubigeo.substr(6, ubigeo.length - 6);
            html += "<option value='";
            html += idDpto;
            html += "'>";
            html += nombre;
            html += "</option>";
        }        
    }
    cboDepartamento.innerHTML = html;
    listarProvincias();
}

function listarProvincias() {
    var html = "<option value=''>Seleccione</option>";
    var ubigeo, idDpto, idProv, idDist, nombre;
    var idDptoSel = cboDepartamento.value;
    var campos = [];
    for (var i = 0; i < nRegUbigeo; i++) {
        campos = listaUbigeo[i].split('|');
        ubigeo = campos[0];
        idDpto = ubigeo.substr(0, 2);
        idProv = ubigeo.substr(2, 2);
        idDist = ubigeo.substr(4, 2);
        if (idDpto == idDptoSel && idProv != "00" && idDist == "00") {
            nombre = ubigeo.substr(6, ubigeo.length - 6);
            html += "<option value='";
            html += idProv;
            html += "'>";
            html += nombre;
            html += "</option>";
        }
    }
    cboProvincia.innerHTML = html;
    listarDistritos();
}

function listarDistritos() {
    var html = "<option value=''>Seleccione</option>";
    var ubigeo, idDpto, idProv, idDist, nombre;
    var idDptoSel = cboDepartamento.value;
    var idProvSel = cboProvincia.value;
    var campos = [];
    for (var i = 0; i < nRegUbigeo; i++) {
        campos = listaUbigeo[i].split('|');
        ubigeo = campos[0];
        idDpto = ubigeo.substr(0, 2);
        idProv = ubigeo.substr(2, 2);
        idDist = ubigeo.substr(4, 2);
        if (idDpto == idDptoSel && idProv == idProvSel && idDist != "00") {
            nombre = ubigeo.substr(6, ubigeo.length - 6);
            html += "<option value='";
            html += idDist;
            html += "'";
            if (campos[1] != "") {
                html += " data-pos='";
                html += campos[1];
                html += "'";
            }
            html += ">";
            html += nombre;
            html += "</option>";
        }
    }
    cboDistrito.innerHTML = html;
}

function iniciarMapa()
{
    navigator.geolocation.getCurrentPosition(function (position) {
        //alert(position.coords.latitude);
        mapa = L.map('divMapa').setView([position.coords.latitude, position.coords.longitude], 20);
        //mapa = L.map('divMapa').setView([-12.068872048271029, -77.13377058506013], 20);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapa);
        mapa.on('click', seleccionarUbicacion);
        txtUbicacion.value = position.coords.latitude + "," + position.coords.longitude;

    }, Excepciones);

    

    /*var Geolocalizacion = navigator.geolocation || (window.google && google.gears && google.gears.factory.create('beta.geolocation'));
    if (Geolocalizacion) Geolocalizacion.getCurrentPosition(MuestraLocalizacion, Excepciones);*/

    /*if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }*/
   
}

function showPosition(position)
{
    alert(position);
    alert(position.coords);
    alert(position.coords.latitude);
    /*x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;*/
    mapa = L.map('divMapa').setView([position.coords.latitude, position.coords.longitude], 20);
    //mapa = L.map('divMapa').setView([-12.068872048271029, -77.13377058506013], 20);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);
    mapa.on('click', seleccionarUbicacion);
}
function seleccionarUbicacion(e) {
    var latlng = e.latlng;
    txtUbicacion.value = latlng.lat.toString() + "," + latlng.lng.toString();
}

function MuestraLocalizacion(posicion) {
    alert(posicion.coords.latitude);
    alert(posicion.coords.longitude);
    alert(posicion.coords.accuracy);
}

function Excepciones(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Activa permisos de geolocalizacion');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Activa localizacion por GPS o Redes .');
            break;
        default:
            alert('ERROR: ' + error.code);
    }
}


function mostrarRegistrar(rpta) {    
    if (!rpta.startsWith("Error")) {
        tblArchivo.style.display = "table-cell";
        idProyecto = rpta;
        alert("Se registro el proyecto con Id: " + idProyecto);
    }
    else {
        alert(rpta);
    }
}

function iniciarVariablesSubida() {
    matriz = grilla.ObtenerMatriz();
    totalArchivos = grilla.ObtenerLongitudMatriz();
    contadorArchivos = 0;
    nombreArchivo = matriz[contadorArchivos][0];
    sizeArchivo = matriz[contadorArchivos][1];
    totalViajesArchivo = Math.floor(sizeArchivo / paquete);
    if (sizeArchivo % paquete > 0) totalViajesArchivo++;
    contadorViajesArchivo = 0;
    pbrArchivo.value = 0;
    pbrArchivo.max = totalViajesArchivo;
    pbrTotal.value = 0;
    pbrTotal.max = totalArchivos;
    filas = document.getElementById("tbDataarchivo").rows;
    fila = filas[contadorArchivos];
}

function enviarArchivo() {
    fila.childNodes[2].innerText = "En progreso";
    var inicio = contadorViajesArchivo * paquete;
    var totalBytes = paquete;
    var flag = "P";
    if (contadorViajesArchivo == 0) flag = "I";
    if (sizeArchivo < paquete) {
        totalBytes = sizeArchivo;
        flag = "C";
    }
    else {
        if (contadorViajesArchivo == totalViajesArchivo - 1) {
            totalBytes = sizeArchivo % paquete;
            flag = "F";
        }
    }
    var file = fupArchivo.files[contadorArchivos];
    var blob = file.slice(inicio, inicio + totalBytes);
    var url = "Proyecto/subirArchivo?idProyecto=" + idProyecto;
    url += "&archivo=" + nombreArchivo + "&flag=" + flag;
    Http.post(url, mostrarRptaSubir, blob);
}

function mostrarRptaSubir(rpta) {
    if (rpta == "OK") {
        contadorViajesArchivo++;
        spnProgresoArchivo.innerText = contadorViajesArchivo + " de " + totalViajesArchivo;
        pbrArchivo.value = contadorViajesArchivo;
        if (contadorViajesArchivo < totalViajesArchivo) {
            enviarArchivo();
        }
        else {
            fila.childNodes[2].innerText = "Finalizado";
            contadorArchivos++;
            fila = filas[contadorArchivos];
            spnProgresoTotal.innerText = contadorArchivos + " de " + totalArchivos;
            pbrTotal.value = contadorArchivos;
            if (contadorArchivos < totalArchivos) {
                nombreArchivo = matriz[contadorArchivos][0];
                sizeArchivo = matriz[contadorArchivos][1];
                totalViajesArchivo = Math.floor(sizeArchivo / paquete);
                if (sizeArchivo % paquete > 0) totalViajesArchivo++;
                contadorViajesArchivo = 0;
                pbrArchivo.value = 0;
                pbrArchivo.max = totalViajesArchivo;                
                enviarArchivo();
            }
            else {
                pbrTotal.value = pbrTotal.max;
                alert("Se subio todos los archivos");
            }
        }
    }
}