window.onload = function () {
    sessionStorage.setItem("Token", hdfToken.value);

    Http.getBytes("Turismo/crearCaptchaBytes", mostrarCaptchaBytes);

    spnActualizarCaptcha.onclick = function () {
        Http.getBytes("Turismo/crearCaptchaBytes", mostrarCaptchaBytes);
    }

    btnAceptar.onclick = function () {
        if (Validacion.ValidarRequeridos("R", spnValida)) {
            var usuario = txtUsuario.value;
            var clave = txtClave.value;
            var codigo = txtCodigo.value;
            var claveCifrada = CryptoJS.SHA256(clave).toString();

            var url = "Turismo/validarLogin?usuario=" + usuario;
            url += "&clave=" + claveCifrada + "&codigo=" + codigo;
            Http.get(url, function(rpta){
                if (rpta) {
                    alert(rpta);
                    if (!rpta.startsWith("Error")) {
                        sessionStorage.setItem("Usuario", txtUsuario.value);
                        window.location.href = hdfRaiz.value + "Turismo/Registro";
                    }
                }
            });
        }
    }
}

function mostrarCaptchaBytes(rpta) {
    if (rpta.byteLength > 0) {
        var blob = new Blob([rpta], {"type": "image/png"});
        imgCaptcha.src = URL.createObjectURL(blob);
    }
}