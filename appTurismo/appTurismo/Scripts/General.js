/**
 Codigo LDueñas
 */
var Http = (function () {
    function Http() {
    }
    Http.get = function (url, callBack) {
        requestServer(url, "get", callBack);
    }
    Http.getBytes = function (url, callBack) {
        requestServer(url, "get", callBack, null, "arraybuffer");
    }
    Http.post = function (url, callBack, data) {
        requestServer(url, "post", callBack, data);
    }
    Http.postDownload = function (url, callBack, data) {
        requestServer(url, "post", callBack, data, "arraybuffer");
    }
    Http.navigateUrl = function (url) {
        var token = sessionStorage.getItem("Token");
        if (token != null) {
            window.location.href = hdfRaiz.value + "Sistema/Principal?token=" + token;
        }
        else window.location.href = hdfRaiz.value + "Sistema/Principal";
    }
    function requestServer(url, metodoHttp, callBack, data, tipoRpta) {
        var xhr = new XMLHttpRequest();
        xhr.open(metodoHttp, hdfRaiz.value + url);
        if (tipoRpta != null) xhr.responseType = tipoRpta;
        var token = sessionStorage.getItem("Token");
        if (token != null) {
            xhr.setRequestHeader("token", token);
        }
        xhr.onreadystatechange = function () {
            if (xhr.status == 200 && xhr.readyState == 4) {
                if (tipoRpta != null) callBack(xhr.response);
                else callBack(xhr.responseText);
            }
        }
        if (data != null) xhr.send(data);
        else xhr.send();
    }
    return Http;
})();
