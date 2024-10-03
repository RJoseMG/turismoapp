var mapa;

window.onload = function () {
    //Http.get("Proyecto/obtenerListas", mostrarListas);
    iniciarMapa();

    btnVerMapa.onclick = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            alert(position.coords.latitude);
        }, Excepciones);
    }
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

