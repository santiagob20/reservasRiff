/*
 * Creado por:
 * Sebastian Pinto Becerra
 * Santiago Barrera
 *  
 * Universidad Central - 2019 
 */
$(document).ready(inicio);
function inicio() {
    //Coloca la pagina al ser cargada en la parte de arriba
    $(this).scrollTop(0);
    //Obtiene mi posicion en coordenadas para el mapa
    obtenerMiPosicion();

    //OPCIONES DE USUARIO ---------------------------------------------------------------------------------------------
    //Accion de click al boton inicio de sesión
    $("#btnIniciarSesion").click(clickInicioSesion);
    //Accion de click al boton cerrar sesión
    $("#cerrarSesionUsuario").click(clickCerrarSesion);
    //Accion de click al boton Perfil del usuario
    $("#perfilUsuario").click(accesoPerfilUsuario);
    //Accion para ver los usuarios registrados
    $("#verUsuarios").click(verUsuarios);
    //REGISTRO DE USUARIO ---------------------------------------------------------------------------------------------
    //Muestra el modal de registro de usuario ocultando el modal de inicio de sesión
    $("#registroUsuario").click(function () {
        $("#loginModal").modal('hide');
        $("#registroModal").modal('show');
    });
    //Accion de click al boton registrar usuario
    $("#btnRegistrarUsuario").click(clickRegistroUsuario);

    // RESERAVS ACTIVAS E HISTORICO ----------------------------------------------------------------------------------------------------------
    //Accion de click a mostrar las reservas activas
    $("#reservasActivas").click(accesoReservasActivas);
    //Accion de click a mostrar el historico de reservas
    $("#historicoReservas").click(accesoHistoricoReservas);

    // MAPA ----------------------------------------------------------------------------------------------------------
    //Accion de click a mostrar el mapa
    $("#mapaRiff").click(accesoMapaRiff);
    // LISTADO SALAS DE ENSAYO ----------------------------------------------------------------------------------------------------------
    //Accion de click al listado de salas de ensayo 
    $("#listadoSalasEnsayo").click(accesolistadoSalasEnsayo);
    //PRUEBA CALENDARIO ---------------------------------------------------------------------------------------------
    //Accion de click para buscar por rango de fechas, funcionalidad en desarrollo
    $("#btnBuscarRangoCalendario").click(busquedaRangoFechasCalendario);
    //CONTACTENOS ------------------------------------------------------------------------------------------------------
    //Accion de click para acceder al modulo de contactenos de Riff
    $("#pagContactenosAcceso").click(accesoContactenos);
    //Accion de click para enviar el formulario de contacto de la sala
    $("#btnEnviarDatosContactenos").click(clickContactoUsuarioApp);
    //EVALUO DE LA SESION ACTIVA 
    if (localStorage.getItem("idSession") !== null) {
        skip();
        accesoMapaRiff();
        usuarioSesionIniciada(dataUsuario.usuario);
    } else {
        skipInicio();
        //Controla la velocidad del video
        document.getElementById("videoo").playbackRate = 1.7
    }
}

var server = 'http://localhost:9591/';
var dataUsuario = '';
var fechaCalendario = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();

// FUNCIONES DE ACCION DEL CLICK
function clickInicioSesion() {
    $("#btnIniciarSesion").hide();
    spinerLoading("Login");
    let usuario = $("#usuarioSesion").val();
    let password = getSha256($("#passwordSesion").val());
    $.ajax({
        url: server + "Riff/app/restServices/inicioSesionUsuario",
        data: JSON.stringify({
            usuario: usuario,
            clave: password
        }),
        type: "POST",
        async: false,
        cache: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                dataUsuario = rta.listaUsuarios[0];
                //ALMACENAMOS EL ID DE SESION Y EL USUARIO EN EL LOCALSTORAGE
                localStorage.setItem("idSession", Math.floor(1e9 + (Math.random() * 9e9)));
                localStorage.setItem("usuarioLogueado", dataUsuario.usuario);
                localStorage.setItem("dataUsuario", JSON.stringify(dataUsuario));
                usuarioSesionIniciada();
            } else {
                alert(rta.descripcion);
                console.log(rta);
                window.location = server + "Riff/index.html";
            }
            $("#btnIniciarSesion").show();
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function clickCerrarSesion() {
    localStorage.removeItem('idSession');
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('dataUsuario');
    localStorage.removeItem('PosicionUser');
    window.location = server + "Riff/index.html";
}
function clickRegistroUsuario() {
    $("#btnRegistrarUsuario").hide();
    spinerLoading("Registro");
    let identificacion = $("#txtIdentificacion").val();
    let nombres = $("#txtNombres").val();
    let apellidos = $("#txtApellidos").val();
    let fechaNacimiento = new Date($("#fechaNacimiento").val());
    let direccionResidencia = $("#txtDireccion").val();
    let telefono = $("#txtTelefono").val();
    let correoElectronico = $("#txtCorreoElectronico").val();
    let usuario = $("#txtUsuario").val();
    let password = $("#txtPassword").val();
    // VALIDAR DATOS DE CADA CAMPO (SE DEBEN LLENAR TODOS LOS CAMPOS)
    if (identificacion !== '' && nombres !== '' &&
            apellidos !== '' && fechaNacimiento !== '' &&
            direccionResidencia !== '' && telefono !== '' &&
            correoElectronico !== '' && usuario !== '' && password !== '') {
        $.ajax({
            url: server + "Riff/app/restServices/crearUsuario",
            data: JSON.stringify({
                identificacion: identificacion,
                nombre: nombres,
                apellido: apellidos,
                fechaNacimiento: fechaNacimiento,
                direccionResidencia: direccionResidencia,
                telefono: telefono,
                correoElectronico: correoElectronico,
                usuario: usuario,
                clave: password
            }),
            type: 'POST',
            async: false,
            cache: false,
            contentType: 'application/json',
            success: function (rta) {
                if (rta.codigo === 1) {
                    $("#registroModal").modal("hide");
                    innerModalInformativo("<b>Registro de usuario</b>",
                            "el usuario se ha registrado correctamente.<br><br>Por favor inicie sesión.",
                            "", false);
                    $("#loginModal").modal("show");
                } else {
                    innerModalInformativo("<b>Registro de Usuario</b>",
                            "<p style='color: red;'>" + rta.descripcionError + "</p>",
                            "", false);
                }
                $("#spinnerLoadingRegistro").hide();
                $("#btnRegistrarUsuario").show();
            },
            error: function (error) {
                console.log(error.status);
            }
        });
    } else {
        innerModalInformativo("<b>Registro de Usuario</b>",
                "<p style='color: red;'>Por favor llenar el formulario completo.</p>",
                "", false);
        $("#spinnerLoadingRegistro").hide();
        $("#btnRegistrarUsuario").show();
    }
}
function clickContactoUsuarioApp() {
    let nombreContacto = $("#nombreContactenos").val();
    let emailContacto = $("#emailContactenos").val();
    let telefonoContacto = $("#telefonoContactenos").val();
    let cajaMensajeContacto = $("#cajaMensajeContactenos").val();
    $.ajax({
        url: server + "Riff/app/restServices/contactanosRiff",
        data: JSON.stringify({
            nombre: nombreContacto,
            correoElectronico: emailContacto,
            mensajeContactenos: cajaMensajeContacto
        }),
        type: 'POST',
        cache: false,
        async: false,
        contentType: 'application/json',
        success: function (respuesta) {
            if (respuesta.codigo === 1) {
                innerModalInformativo("Mensaje enviado",
                        respuesta.descripcion + "<br><br>En breve nos contactaremos contigo.",
                        "", false);
            } else {
                innerModalInformativo("Error al enviar el mensaje",
                        respuesta.descripcionError,
                        "", false);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// FUNCIONES GENERALES -------------------------------------------------
/*
 * Las funciones skip sirven para volver la pagina a su estado inicial ocultando
 * todos los componentes del software
 */
function skipInicio() {
    $("#img-div-inicio").hide();
    $("#bienvenido-div-inicio").hide();
    $("#img-div-inicio").fadeIn(3000);
    $("#bienvenido-div-inicio").fadeIn(3000);
    $("#container-text-inicio").hide();
    $("#container-text-inicio").delay(1000).slideDown("slow");
    $("#footerAplicacion").hide();
    $("#mainNav").hide();
    $("#cuerpoPaginaRiff").hide();
    $("#inicioRiff").show();
}
function skip() {
    $("#footerAplicacion").show();
    $("#mainNav").show();
    $("#cuerpoPaginaRiff").show();
    $("#inicioRiff").hide();
    $("#pagInicio").hide();
    $("#cardsSitios").hide();
    $("#pagReservasActivas").hide();
    $("#pagHistoricoReservas").hide();
    $("#pagContactenos").hide();
    //SITIOS
    $("#pagSitios").hide();
    $("#cuevaDeLaCebra").hide();
    $("#cardsSalas").hide();
    $("#pagMapa").show();
}
function soloNumeros(event, _float) {
    event = event || window.event;
    var key = event.which || event.keyCode;
    var first = ((key >= 48 && key <= 57) || (key === 8));
    if (_float) {
        var element = event.srcElement || event.target;
        return first || (element.value.indexOf('.') === -1 ? (key === 46) : false); //|| (key === 44)
    }
    return first;
}
function imagenConvertB64(input, destino) {
    console.log(input, destino);
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var filePreview = document.createElement('img');
            filePreview.id = 'file-preview';
            //e.target.result contents the base64 data from the image uploaded
            filePreview.src = e.target.result;
            var previewZone = document.getElementById(destino);
            previewZone.appendChild(filePreview);
            $("#" + destino).hide();
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function ResizeImage() {

}

// Almacena convierte un string en SHA256
function getSha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = getSha256.h = getSha256.h || [];
    var k = getSha256.k = getSha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56)
        ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8)
            return;
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength);
    for (j = 0; j < words[lengthProperty]; ) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15], w2 = w[i - 2];
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                            w[i - 16]
                            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                            + w[i - 7]
                            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                            ) | 0
                            );
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
}
// Carga los datos del usuario con sesión iniciada
function usuarioSesionIniciada() {
    $("#usuarioSesionIniciada").removeAttr("hidden");
    $("#inicioSesionUsuario").attr("hidden", true);
    document.getElementById("usuarioSesionIniciada").innerHTML = null;
    $("#usuarioSesionIniciada").append('<i class="fa fa-user"></i>  ' + localStorage.getItem("usuarioLogueado") +
            '<span class="d-lg-none">' +
            '<span class="badge badge-pill badge-primary"></span>' +
            '</span>');
    $("#loginModal").modal('hide');
    if (obtenerRol() === 1) {
        $("#verUsuarios").remove();
    }
}
function innerModalInformativo(header, body, footer, xlModal) {
//HEADER
    document.getElementById('headerModalInformativo').innerHTML = null;
    document.getElementById('headerModalInformativo').innerHTML = header;
    //BODY
    document.getElementById('bodyModalInofrmativo').innerHTML = null;
    document.getElementById('bodyModalInofrmativo').innerHTML = body;
    //FOOTER
    document.getElementById('footerModalInformativo').innerHTML = null;
    document.getElementById('footerModalInformativo').innerHTML = footer;
    //REMOVEMOS LAS CLASES PARA EL MODAL XL
    if (!xlModal) {
        $('#modalInformativo').removeClass('bd-example-modal-xl');
        $('#modal-dialog').removeClass('modal-xl');
    }

    $("#modalInformativo").modal('show');
}
function spinerLoading(id) {
    document.getElementById("spinnerLoading" + id).innerHTML = null;
    $("#spinnerLoading" + id).append("<div class='d-flex justify-content-center'>" +
            "<div class='spinner-grow text-dark' role='status'>" +
            "<span class='sr-only'>Loading...</span>" +
            "</div>" +
            "</div>");
}
function obtenerRol() {
    let data = JSON.parse(localStorage.getItem("dataUsuario"));
    return data.id_rol;
}

// CALENDARIO ---------------------------------------------------------------------------------------------
function calendarioReservas(id) {

    fechaCalendario = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();
    $("#" + id).hide();
    spinerLoading(id);
    document.getElementById("calendario").innerHTML = null;
    document.getElementById("headerModalCalendario").innerHTML = null;
    document.getElementById("consultaFechas").innerHTML = null;
    var establecimiento = id.split("-")[0];
    let sala = id.split("-")[1];
    $.ajax({
        url: server + "Riff/app/restServices/verHorarios",
        type: 'GET',
        async: false,
        cache: false,
        contentType: 'application/json',
        success: function (rta) {
            if (rta.codigo === 1) {
                let listaDataCalendario = rta.listaHorarios;
                let arrCalendario = [];
                let fecha;
                let objCal;
                try {
                    for (var i = 0; i < 7; i++) {
                        let arrDisponibilidad = [];
                        switch (establecimiento) {
                            case "LA_CUEVA_DE_LA_CEBRA":
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h8).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h9).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h10).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h11).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h12).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h13).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h14).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h15).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h16).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h17).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h18).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h19).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h20).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h21).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h22).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h23).LA_CUEVA_DE_LA_CEBRA[sala]);
                                fecha = listaDataCalendario[i].fecha;
                                objCal = {
                                    fecha: fecha,
                                    arrHorarios: arrDisponibilidad
                                };
                                arrCalendario.push(objCal);
                                break;
                        }
                    }
                    printCalendario(arrCalendario);
                } catch (e) {
                    alert("Sin fechas a mostrar consulte con el administrador");
                    console.log("calendarioReservas: " + e);
                }
            } else {
                innerModalInformativo("<b style='color: red;'>Error al consultar</b>",
                        "Por favor consulte con el administrador<br>" + rta.descripcionError,
                        "", false);
            }
            function printCalendario(calendario) {
                let columnas = '<tr><th class="grilla grillaEncabezado">Hora</th>';
                //COLUMNAS
                for (let index = 0; index < 7; index++) {
                    columnas += '<th class="grilla grillaEncabezado">' + calendario[index].fecha + '</th>';
                }
                $("#calendario").append(columnas);
                //FILAS
                for (var i = 0; i <= 15; i++) {
                    let columnasData = '<tr><th class="grilla ui-widget-content">' + (i + 8) + '</th>';
                    //COLUMNAS
                    for (var j = 0; j < 7; j++) {
                        if (calendario[j].arrHorarios[i].estado === 'ocupado') {
                            columnasData += '<th id="Ya reservado, favor selecione otro horario." onclick="alert(this.id)" style="background-color: #DE0000CC;color: white;" class="grilla ui-widget-content">' +
                                    calendario[j].arrHorarios[i].estado + '</th>';
                        } else {
                            columnasData += '<th id="' + (i + 8) + "/" + calendario[j].fecha +
                                    '" onclick="reservarFechaHora(this.id)" class="grilla ui-widget-content">' +
                                    calendario[j].arrHorarios[i].estado + '</th>';
                        }
                    }
                    $("#calendario").append(columnasData);

                }
                document.getElementById("headerModalCalendario").innerHTML = "<b>" + sala + "</b>";
                //BOTONES DE FECHAS ANTERIORES Y SIGUIENTES
                $("#consultaFechas").append("<a id='LA_CUEVA_DE_LA_CEBRA-" + sala + "' onClick='verMenosFechasCalendario(this.id)' class='btn btn-primary' style='margin-left: 17px; '><b><i class='fa fa-angle-left busquedaSigCalendario'></i></b></a>" +
                        "<a id='LA_CUEVA_DE_LA_CEBRA-" + sala + "' onClick='verMasFechasCalendario(this.id)' class='btn btn-primary'style='margin-left: 5px;'><b><i class='fa fa-angle-right busquedaSigCalendario'></i></b></a>");
                $("#modalCalendario").modal("show");
            }
            $("#spinnerLoading" + id).hide();
            $("#" + id).show();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function verMasFechasCalendario(id) {
    fechaCalendario = editar_fecha(fechaCalendario, "+7", "d");
    let fechaFormato = fechaCalendario.split("-")[2] + "-" + fechaCalendario.split("-")[1] + "-" + fechaCalendario.split("-")[0];
    document.getElementById("calendario").innerHTML = null;
    var establecimiento = id.split("-")[0];
    let sala = id.split("-")[1];
    $.ajax({
        url: server + "Riff/app/restServices/verMasHorarios",
        data: JSON.stringify({
            fechaReserva: fechaFormato
        }),
        type: 'POST',
        async: false,
        cache: false,
        contentType: 'application/json',
        success: function (rta) {
            if (rta.codigo === 1) {
                let listaDataCalendario = rta.listaHorarios;
                let arrCalendario = [];
                let fecha;
                let objCal;
                try {
                    for (var i = 0; i < 7; i++) {
                        let arrDisponibilidad = [];
                        switch (establecimiento) {
                            case "LA_CUEVA_DE_LA_CEBRA":
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h8).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h9).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h10).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h11).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h12).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h13).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h14).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h15).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h16).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h17).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h18).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h19).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h20).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h21).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h22).LA_CUEVA_DE_LA_CEBRA[sala]);
                                arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h23).LA_CUEVA_DE_LA_CEBRA[sala]);
                                fecha = listaDataCalendario[i].fecha;
                                objCal = {
                                    fecha: fecha,
                                    arrHorarios: arrDisponibilidad
                                };
                                arrCalendario.push(objCal);
                                break;
                        }
                    }
                    printCalendario(arrCalendario);
                } catch (e) {
                    alert("Solo se permite por parte de LA CUEVA DE LA CEBRA, realizar reservas con un numero determinado de semanas.");
                    console.log("verMasFechasCalendario: " + e);
                    $("#modalCalendario").modal("hide");
                }
            } else {
                innerModalInformativo("<b style='color: red;'>Error al consultar</b>",
                        "Por favor consulte con el administrador<br>" + rta.descripcionError,
                        "", false);
            }
            function printCalendario(calendario) {
                let columnas = '<tr><th class="grilla grillaEncabezado">Hora</th>';
                //COLUMNAS
                for (let index = 0; index < 7; index++) {
                    columnas += '<th class="grilla grillaEncabezado">' + calendario[index].fecha + '</th>';
                }
                $("#calendario").append(columnas);
                //FILAS
                for (var i = 0; i <= 15; i++) {
                    let columnasData = '<tr><th class="grilla ui-widget-content">' + (i + 8) + '</th>';
                    //COLUMNAS
                    for (var j = 0; j < 7; j++) {
                        if (calendario[j].arrHorarios[i].estado === 'ocupado') {
                            columnasData += '<th id="Ya reservado, favor selecione otro horario." onclick="alert(this.id)" style="background-color: #DE0000CC;color: white;" class="grilla ui-widget-content">' +
                                    calendario[j].arrHorarios[i].estado + '</th>';
                        } else {
                            columnasData += '<th id="' + (i + 8) + "/" + calendario[j].fecha +
                                    '" onclick="reservarFechaHora(this.id)" class="grilla ui-widget-content">' +
                                    calendario[j].arrHorarios[i].estado + '</th>';
                        }
                    }
                    $("#calendario").append(columnasData);
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function verMenosFechasCalendario(id) {
    fechaCalendario = editar_fecha(fechaCalendario, "-7", "d");
    let fechaFormato = fechaCalendario.split("-")[2] + "-" + fechaCalendario.split("-")[1] + "-" + fechaCalendario.split("-")[0];
    document.getElementById("calendario").innerHTML = null;
    var establecimiento = id.split("-")[0];
    let sala = id.split("-")[1];
    $.ajax({
        url: server + "Riff/app/restServices/verMasHorarios",
        data: JSON.stringify({
            fechaReserva: fechaFormato
        }),
        type: 'POST',
        async: false,
        cache: false,
        contentType: 'application/json',
        success: function (rta) {
            if (rta.codigo === 1) {
                let listaDataCalendario = rta.listaHorarios;
                let arrCalendario = [];
                let fecha;
                let objCal;
                if (listaDataCalendario.length > 1) {
                    try {
                        for (var i = 0; i < 7; i++) {
                            let arrDisponibilidad = [];
                            switch (establecimiento) {
                                case "LA_CUEVA_DE_LA_CEBRA":
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h8).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h9).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h10).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h11).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h12).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h13).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h14).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h15).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h16).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h17).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h18).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h19).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h20).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h21).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h22).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    arrDisponibilidad.push(JSON.parse(listaDataCalendario[i].h23).LA_CUEVA_DE_LA_CEBRA[sala]);
                                    fecha = listaDataCalendario[i].fecha;
                                    objCal = {
                                        fecha: fecha,
                                        arrHorarios: arrDisponibilidad
                                    };
                                    arrCalendario.push(objCal);
                                    break;
                            }
                        }
                        printCalendario(arrCalendario);
                    } catch (e) {
                        alert("Sin fechas a mostrar consulte con el administrador");
                        console.log("verMenosFechasCalendario: " + e);
                    }
                } else {
                    alert("No puede hacer reservas anteriores al día de hoy.");
                    $("#modalCalendario").modal("hide");
                }
            } else {
                innerModalInformativo("<b style='color: red;'>Error al consultar</b>",
                        "Por favor consulte con el administrador<br>" + rta.descripcionError,
                        "", false);
            }
            function printCalendario(calendario) {
                let columnas = '<tr><th class="grilla grillaEncabezado">Hora</th>';
                //COLUMNAS
                for (let index = 0; index < 7; index++) {
                    columnas += '<th class="grilla grillaEncabezado">' + calendario[index].fecha + '</th>';
                }
                $("#calendario").append(columnas);
                //FILAS
                for (var i = 0; i <= 15; i++) {
                    let columnasData = '<tr><th class="grilla ui-widget-content">' + (i + 8) + '</th>';
                    //COLUMNAS
                    for (var j = 0; j < 7; j++) {
                        if (calendario[j].arrHorarios[i].estado === 'ocupado') {
                            columnasData += '<th id="Ya reservado, favor selecione otro horario." onclick="alert(this.id)" style="background-color: #DE0000CC;color: white;" class="grilla ui-widget-content">' +
                                    calendario[j].arrHorarios[i].estado + '</th>';
                        } else {
                            columnasData += '<th id="' + (i + 8) + "/" + calendario[j].fecha +
                                    '" onclick="reservarFechaHora(this.id)" class="grilla ui-widget-content">' +
                                    calendario[j].arrHorarios[i].estado + '</th>';
                        }
                    }
                    $("#calendario").append(columnasData);
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function editar_fecha(fecha, intervalo, dma, separador) {
    var separador = separador || "-";
    var arrayFecha = fecha.split(separador);
    var dia = arrayFecha[0];
    var mes = arrayFecha[1];
    var anio = arrayFecha[2];
    var fechaInicial = new Date(anio, mes - 1, dia);
    var fechaFinal = fechaInicial;
    if (dma === "m" || dma === "M") {
        fechaFinal.setMonth(fechaInicial.getMonth() + parseInt(intervalo));
    } else if (dma === "y" || dma === "Y") {
        fechaFinal.setFullYear(fechaInicial.getFullYear() + parseInt(intervalo));
    } else if (dma === "d" || dma === "D") {
        fechaFinal.setDate(fechaInicial.getDate() + parseInt(intervalo));
    } else {
        return fecha;
    }
    dia = fechaFinal.getDate();
    mes = fechaFinal.getMonth() + 1;
    anio = fechaFinal.getFullYear();
    dia = (dia.toString().length === 1) ? "0" + dia.toString() : dia;
    mes = (mes.toString().length === 1) ? "0" + mes.toString() : mes;
    return dia + "-" + mes + "-" + anio;
}
function confirmarReserva(id) {
    $("#modalCalendario").modal("hide");
    $("#modalConfirmacion").modal("show");
    sessionStorage.setItem("idReserva", id);
}
function reservarFechaHora(id) {
    $("#modalCalendario").modal("hide");
    let sala = $("#headerModalCalendario").text();
    let horaInicio;
    let horaFin;
    let horaFinModal;
    if (id.split("/")[0] < 10) {
        horaInicio = "0" + id.split("/")[0] + ":00:00";
    } else {
        horaInicio = id.split("/")[0] + ":00:00";
    }
    if ((Number(id.split("/")[0]) + 1) < 10) {
        horaFin = "0" + (Number(id.split("/")[0]) + 1) + ":00:00";
        if ((Number(id.split("/")[0]) + 2) < 10) {
            horaFinModal = "0" + (Number(id.split("/")[0]) + 2) + ":00:00";
        } else {
            horaFinModal = (Number(id.split("/")[0]) + 2) + ":00:00";
        }
    } else {
        horaFin = (Number(id.split("/")[0]) + 1) + ":00:00";
        horaFinModal = (Number(id.split("/")[0]) + 2) + ":00:00";
    }
    let fecha = id.split("/")[1];
    let idPrecio;
    let idSala;
    switch (sala) {
        case "AMATISTA":
            idPrecio = 5;
            idSala = 2;
            break;
        case "BOHIO":
            idPrecio = 3;
            idSala = 1;
            break;
        case "MILES":
            idPrecio = 7;
            idSala = 3;
            break;
    }
    if (localStorage.getItem("idSession") !== null) {
        let idUsuario = JSON.parse(localStorage.getItem("dataUsuario")).id_usuario;
        if (id.split("/")[0] <= 22) {
            $.ajax({
                url: server + "Riff/app/restServices/crearReserva",
                data: JSON.stringify({
                    nombreEmpresa: "LA_CUEVA_DE_LA_CEBRA",
                    idUsuario: idUsuario,
                    idPrecio: idPrecio,
                    idSala: idSala,
                    fechaReserva: fecha,
                    horaInicio: horaInicio,
                    horaFin: horaFin
                }),
                type: 'POST',
                async: false,
                cache: false,
                contentType: 'application/json',
                success: function (rta) {
                    if (rta.codigo === 1) {
                        innerModalInformativo("<b>Reserva realizada con éxito</b>",
                                "Datos de la reserva:" +
                                "<br><b>Sala:</b> " + sala +
                                "<br><b>Fecha:</b> " + fecha +
                                "<br><b>Hora de inicio:</b> " + horaInicio +
                                "<br><b>Hora fin:</b> " + horaFinModal,
                                "", false);
                    } else {
                        console.log(rta);
                        innerModalInformativo("<b style='color: red;'>Error al reservar</b>",
                                rta.descripcionError,
                                "", false);
                    }
                }, error: function (err) {
                    console.log(err);
                }
            });
        } else {
            innerModalInformativo("<b style='color: red;'>Error al reservar</b>",
                    "No es posible reservar a esta hora, el último horario disponible es a las 10:00 pm.",
                    "", false);
        }
    } else {
        innerModalInformativo("<b style='color: red;'>Error al reservar</b>",
                "Usuario sin sesión iniciada<br>Por favor Loguese primero.",
                "", false);
    }
    sessionStorage.removeItem("idReserva");
}
function busquedaRangoFechasCalendario() {
    /*
     * Funcionalidad en desarrollo
     */
//    alert($("#txtfechaInicialCalendario").val());
//    alert($("#txtfechaFinalCalendario").val());
}

// ACCESO ---------------------------------------------------------------------------------------------
/*
 * Las funciones de acceso se utilizan para realizar validaciones previsa al 
 * ingreso al modulo como lo es la sesion iniciada del usuario o permisos del mismo
 */
function accesoInicio() {
    cargarMapa();
    skip();
    $("#pagMapa").show();
}
function accesoPerfilUsuario() {
    let dataUsuario = consultaDataPerfilUsuario();
    //CLASES PARA LANZAR UN MODAL XL 
//    $('#modalInformativo').addClass('bd-example-modal-xl');
//    $('#modal-dialog').addClass('modal-xl');

    //CLASES PARA LANZAR UN MODAL LG
//    $('#modalInformativo').addClass('bd-example-modal-lg');
//    $('#modal-dialog').addClass('modal-lg');
    innerModalInformativo(
            "Perfil de usuario",
            "<div class='container'>" +
            "<div class='row'>" +
            "<div class='col-lg-6'>" +
            "<img src='imagenes/Logo/logo_riff_blanco.png' style='width: 121px;margin: 10% 0% 0% 33%;'/>" +
            "</div>" +
            "<div class='col-lg-6'>" +
            "<p style='font-size: 22px; font-weight: bolder; margin: 14% 36%;'>Usuario: </p>" +
            "<p style='font-size: 19px; margin: 14% 36%;'>" + dataUsuario.usuario + "</p>" +
            "</div>" +
            "</div>" +
            "<br>" +
            "<hr>" +
            "<div class='row'>" +
            "<div class='col-lg-6'>" +
            "<b>Nombres y apellidos: </b><p> " + dataUsuario.nombre + "</p>" +
            "<b>Fecha de nacimiento: </b><p> " + dataUsuario.fechaNacimiento + "</p>" +
            "<b>Direccion de residencia: </b><p> " + dataUsuario.direccionResidencia + "</p>" +
            "</div>" +
            "<div class='col-lg-6'>" +
            "<b>Teléfono: </b><p> " + dataUsuario.telefono + "</p>" +
            "<b>Correo Electronico: </b><p style='font-size: 14px;'> " + dataUsuario.correoElectronico + "</p>" +
            "</div>" +
            "</div>" +
            "</div>",
            "", false);
}
function accesoReservasActivas() {
    if (localStorage.getItem("idSession") !== null) {
        skip();
        $("#pagMapa").hide();
        $("#pagReservasActivas").show();
        reservasActivas();
    } else {
        alert("Debe ser un usuario logueado para acceder.");
    }
}
function accesoHistoricoReservas() {
    if (localStorage.getItem("idSession") !== null) {
        skip();
        $("#pagMapa").hide();
        $("#pagHistoricoReservas").show();
        historicoReservas();
    } else {
        alert("Debe ser un usuario logueado para acceder.")
    }
}
function accesoMapaRiff() {
    accesoInicio();
}
function accesoSitios(id, ubicacion) {
    skip();
    //Limpia el breadcrumb
    document.getElementById("breadcrumbSitios").innerHTML = null;
    //Agrega un breadcrumb personalizado
    switch (ubicacion) {
        case "mapa":
            $("#breadcrumbSitios").append(" <li class='breadcrumb-item'>" +
                    "<a href='#' onclick='accesoInicio()'>Inicio</a>" +
                    "</li>" +
                    "<li class='breadcrumb-item' ><a class='breadcrumbSegundoNivel' onclick='accesoMapaRiff()'>Mapa</a></li>" +
                    "<li class='breadcrumb-item active'>La Cueva de la cebra</li>");
            break;
        case "cardListado":
            $("#breadcrumbSitios").append(" <li class='breadcrumb-item'>" +
                    "<a href='index.html'>Inicio</a>" +
                    "</li>" +
                    "<li class='breadcrumb-item' ><a class='breadcrumbSegundoNivel' onclick='accesoMapaRiff()'>Mapa</a></li>" +
                    "<li class='breadcrumb-item' ><a class='breadcrumbSegundoNivel' onclick='accesolistadoSalasEnsayo()'>Listado Sitios</a></li>" +
                    "<li class='breadcrumb-item active'>La Cueva de la cebra</li>");
            break;
    }
    $("#pagMapa").hide();
    $("#" + id).show();
    $("#pagSitios").show();
}
function accesoSalas(id, ubicacion) {
    $(this).scrollTop(0);
    skip();
    //Limpia el breadcrumb
    document.getElementById("breadcrumbSalas").innerHTML = null;
    //Agrega un breadcrumb personalizado
    $("#breadcrumbSalas").append(" <li class='breadcrumb-item'>" +
            "<a href='#' onClick='accesoInicio();'>Inicio</a>" +
            "</li>" +
            "<li class='breadcrumb-item' ><a class='breadcrumbSegundoNivel' onclick='accesoMapaRiff()'>Mapa</a></li>" +
            "<li class='breadcrumb-item' ><a class='breadcrumbSegundoNivel' onclick='accesolistadoSalasEnsayo()'>Listado Sitios</a></li>" +
            '<li class="breadcrumb-item" ><a class="breadcrumbSegundoNivel" id="breadcrumbLA_CUEVA_DE_LA_CEBRA" >La Cueva de la cebra</a></li>' +
            "<li class='breadcrumb-item active'>Salas de ensayo</li>");
    $("#breadcrumbLA_CUEVA_DE_LA_CEBRA").attr("onclick", "accesoSitios('cuevaDeLaCebra', 'mapa')");
    $("#pagMapa").hide();
    $("#cardsSalas").show();
    $("#" + id).show();

    $("#cardAmatista").hide();
    $("#cardMiles").hide();
    $("#cardBohio").hide();

    $("#cardAmatista").fadeIn(500);
    $("#cardMiles").fadeIn(500);
    $("#cardBohio").fadeIn(500);
}
function accesolistadoSalasEnsayo() {
    skip();
    //calcularDistancias();
    cargarSalasDisponibles();
    $("#pagMapa").hide();
    $("#cardsSitios").show();
}
function accesoContactenos() {
    skip();
    $("#pagMapa").hide();
    $("#pagContactenos").show();
}

// MAPA ------------------------------------------------------------------------------------------------
function consultaDataPerfilUsuario() {
    let idUsuario = JSON.parse(localStorage.getItem("dataUsuario")).id_usuario;
    let dataUsuario;
    $.ajax({
        url: server + "Riff/app/restServices/consultarUsuario",
        data: JSON.stringify({
            id_usuario: idUsuario
        }),
        type: "POST",
        async: false,
        cache: false,
        contentType: "application/json",
        success: function (respuesta) {
            if (respuesta.codigo === 1) {
                dataUsuario = respuesta.listaUsuarios[0];
            } else {
                innerModalInformativo("<p style='color:red'>Error al consultar</p>",
                        respuesta.descripcionError,
                        "", false);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    return dataUsuario;
}

// MAPA ------------------------------------------------------------------------------------------------
function cargarMapa() {
    var x = document.getElementById("demo");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    function showPosition(position) {
        //Posicion en Corferias para pruebas
//        var lat = 4.606084;
//        var lon = -74.068658;
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        latlon = new google.maps.LatLng(lat, lon);
        mapholder = document.getElementById('mapholder');
        mapholder.style.height = 'auto';
        mapholder.style.width = '100%';
        var myOptions = {
            center: latlon, zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
        };
        var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
        var marker = new google.maps.Marker({
            position: latlon,
            map: map,
            title: "Usted esta aqui"
        });
//        var popup = new google.maps.InfoWindow({content: 'Posicion Actual'});
//        popup.open(map, marker);
        marker.addListener('click', function canchacall() {

        });
        //MARCADO PARA CADA SALA
        var place = new google.maps.LatLng(4.632132, -74.099984);
        var marker1 = new google.maps.Marker({
            position: place
//            , title: 'La cueva de la Cebra'
            , map: map
            , icon: src = "imagenes/Logo/marker_reserv50_50.png"
        });
        var popup = new google.maps.InfoWindow({content: 'La Cueva de la Cebra'});
        popup.open(map, marker1);
        marker1.addListener('click', function () {
            accesoSitios("cuevaDeLaCebra", "mapa");
        });
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "Denegada la peticion de Geolocalización en el navegador."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "La información de la localización no esta disponible."
                break;
            case error.TIMEOUT:
                x.innerHTML = "El tiempo de petición ha expirado."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "Ha ocurrido un error desconocido."
                break;
        }
    }
}
function obtenerMiPosicion() {
    localStorage.removeItem("PosicionUser");
    let vecPosicion = {
        latitud: 0,
        longitud: 0
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            vecPosicion.latitud = position.coords.latitude;
            vecPosicion.longitud = position.coords.longitude;
            localStorage.setItem("PosicionUser", JSON.stringify(vecPosicion));
        });
    }
}
function distanciaKMCoordenadasTierra(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    return earthRadiusKm * c;
}

// CARD SITIOS -----------------------------------------------------------------------------------------
function cargarSalasDisponibles() {
    $.ajax({
        url: server + "Riff/app/restServices/verEmpresas",
        type: "GET",
        async: false,
        cache: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                let arrEmpresas = rta.listaEmpresas;

                let linkImgEmpresas = [
                    'https://scontent-lga3-1.cdninstagram.com/vp/398f89bd27485ddc4d6be4198ec64c66/5D4304F9/t51.2885-15/e35/53067098_494954111333193_453197361341967816_n.jpg?_nc_ht=scontent-lga3-1.cdninstagram.com&se=8',
                    'https://static1.squarespace.com/static/53029fb1e4b0f8636b5e3b93/53040a71e4b00959e150e93d/5409c3ffe4b034ea94086b0e/1409926149396/Sala+1.jpg',
                    'http://www.thehallofrock.com/image.ashx?s=19078&sl=es&im=122560&st=p',
                    'https://static1.squarespace.com/static/53029fb1e4b0f8636b5e3b93/530d51ffe4b0027bb049641a/5421f53ce4b02eeafb50b210/1411511632806/IMG_0920.jpg',
                    'https://static.wixstatic.com/media/e436c6_5ce6c9a2c80a49c2946c557b10e81411.jpg',
                    'https://static.wixstatic.com/media/e436c6_95eb4e82fa4146cbbdda5e3f2de772c9.jpg',
                    'http://www.instrumentosmusicalesjvc.co/wp-content/uploads/2015/09/DSC_0016-1024x681.jpg',
                    'https://static.studiofilter.com/media/52aad060-5c58-11e4-9aee-40404718dfda.jpg',
                    'https://i.ytimg.com/vi/xbuMXcuGOFI/maxresdefault.jpg',
                    'https://image.redbull.com/rbcom/052/2018-03-22/f2c1da27-4ceb-443a-8cc6-4e8a8d7dd720/0100/0/1/estudio-arbol.jpg',
                    'https://static.studiofilter.com/media/5e629996-1735-11e4-a48c-40404718dfda.jpg'
                ];

                document.getElementById("listadoCardEmpresas").innerHTML = null;
                for (var i = 0; i < arrEmpresas.length; i++) {
                    let activo;
                    let filtro;
                    // arrEmpresas[i].activo === 0
                    if (arrEmpresas[i].nombreEmpresa !== 'LA_CUEVA_DE_LA_CEBRA') {
                        activo = "display:none";
                        filtro = "filter: contrast(0.4);";
                    }
                    let emailEmpresa = arrEmpresas[i].correoElectronico;
                    let direccionEmpresa = arrEmpresas[i].direccion;
                    let horarioEmpresa = arrEmpresas[i].horarios;
                    let nombreEmpresa = arrEmpresas[i].nombreEmpresa;
                    let arrNombreEmpresa = (arrEmpresas[i].nombreEmpresa).split(" ");
                    let empresa = "";
                    for (var k = 0; k < arrNombreEmpresa.length; k++) {
                        empresa += arrNombreEmpresa[k];
                    }
//                    let linkImagen = "imagenes/Fotos sitio/Cueva de la Cebra/cueva de la cebra Patio_old.jpeg";
                    let distanciaUsuario = "";
                    let cardModelo = "<div class='card' style='width: 18rem; margin-top: 10px;" + filtro + "'>" +
                            "<!-- !IMAGEN -->" +
                            "<img class='card-img-top' src='" + linkImgEmpresas[i] + "' style='width: 286px;height: 201px;' />" +
                            "<div class='card-body'>" +
                            "<!-- !NOMBRE EMPRESA -->" +
                            "<h5 class='card-title'><b>" + nombreEmpresa + "</b></h5>" +
                            "<div class='infoLine address' style='margin-bottom: 1px; visibility:visible;'>" +
                            "<span class='infoIcon'><i class='fa fa-map-marker fa-fw'></i></span>" +
                            "<div class='infoData' itemprop='address' itemscope='' itemtype='http://schema.org/PostalAddress'>" +
                            "<!-- !DIRECCION EMPRESA -->" +
                            "<span>" + direccionEmpresa + "</span>" +
                            "</div>" +
                            "</div>" +
                            "<div class='infoLine openclose open' style='margin-bottom: 1px; visibility: visible;'>" +
                            "<span class='infoIcon'><i class='fa fa-clock-o fa-fw'></i></span>" +
                            "<div class='infoData'>" +
                            "<span class='today'>" +
                            "<!-- !HORARIOS EMPRESA -->" +
                            "<span class='hours'>" + horarioEmpresa + "</span>" +
                            "</span>" +
                            "</div>" +
                            "</div>" +
                            "<div class='infoLine email' style='margin-bottom: 1px; visibility:visible;'>" +
                            "<span class='infoIcon'><i class='fa fa-envelope-o fa-fw'></i></span>" +
                            "<div class='infoData'>" +
                            "<!-- !EMAIL EMPRESA -->" +
                            "<a href='mailto:lacuevadelacebra@gmail.com' target='_blank' itemprop='email'>" + emailEmpresa + "</a>" +
                            "</div>" +
                            "</div>" +
                            "<!-- !DISTANCIA DE LA EMPRESA RESPECTO AL USUARIO -->" +
                            "<p class='card-text' style='color: whitesmoke' id='distanciaUsuario'>" + distanciaUsuario + "</p>" +
                            "<div class='text-right'>" +
                            "<!-- !LINK ACCESO A LA EMPRESA -->" +
                            "<a id='linkAccesoEmpresa" + empresa + "' class='btn btn-primary' style='width: 60px;cursor: pointer;" + activo + "' >ir</a>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                    $("#listadoCardEmpresas").append(cardModelo);
                    $("#linkAccesoEmpresa" + empresa).attr("onClick", "accesoSitios('" + empresa + "', 'cardListado)')");
                }
                if (JSON.parse(localStorage.getItem("dataUsuario")).id_rol === 2) {
                    let cardAdministrador = "<div id='cardAministrador' class='card text-white' style='background: #1c1c1c4a;width: 288px;height: 387px; cursor: pointer;'>" +
                            "<img src='imagenes/Fotos sitio/signo_mas.png' style='width: 29%;margin: 57% 35%;'/>" +
                            "<div class='card-img-overlay'>" +
                            "<h5 class='card-title'></h5>" +
                            "<p class='card-text'></p>" +
                            "</div>" +
                            "</div>";
                    $("#listadoCardEmpresas").append(cardAdministrador);
                    $("#cardAministrador").attr("onClick", "$('#modalAgregarEmpresa').modal('show')");
                }
            } else {
                innerModalInformativo("<b>Error al consultar</b>", "Error al consultar las empresas, consulte con el administrador");
            }
        },
        error: function () {
            innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
        }
    });
}
function calcularDistancias() {
    let posicionCueva = [4.632132, -74.099984];
    let posicionPakarny = [4.624101, -74.074366];
    let posicionElToke = [4.689083, -74.061597];
    //UBICACION CORFERIAS para pruebas
//    let lat = 4.630132;
//    let lon = -74.089984;
    let lat = JSON.parse(localStorage.getItem("PosicionUser")).latitud;
    let lon = JSON.parse(localStorage.getItem("PosicionUser")).longitud;
    // DISTANCIA AL A CUEVA
    document.getElementById("distanciaUsuarioCueva").innerHTML = "La sala se encuentra aproximadamente a <b>" +
            distanciaKMCoordenadasTierra(lat, lon, posicionCueva[0], posicionCueva[1]).toFixed(2) +
            " KM</b>, de su posición.";
    //DISTANCIA A PAKARNY
    document.getElementById("distanciaUsuarioPakarny").innerHTML = "La sala se encuentra aproximadamente a <b>" +
            distanciaKMCoordenadasTierra(lat, lon, posicionPakarny[0], posicionPakarny[1]).toFixed(2) +
            " KM</b>, de su posición aproximadamente.";
    //DISTANCIA AL TOKE
    document.getElementById("distanciaUsuarioElToke").innerHTML = "La sala se encuentra aproximadamente a <b>" +
            distanciaKMCoordenadasTierra(lat, lon, posicionElToke[0], posicionElToke[1]).toFixed(2) +
            " KM</b>, de su posición aproximadamente.";
}
function agregarInfoSalasEmpresa(cantidad, nombreEmpresa) {
    let nombreEmpresaTrim = nombreEmpresa.split(" ").join("_");
    let numbreEmpresaString = '"' + nombreEmpresaTrim + '"';
    let regex_numeros = /^[0-9]+$/;
    if ((regex_numeros).exec(cantidad) && nombreEmpresaTrim !== "") {
        document.getElementById("formularioSalasCreadas").innerHTML = null;
        for (var i = 0; i < cantidad; i++) {
            let formSalas = "<hr>" +
                    "<form id='" + nombreEmpresaTrim + "Sala" + "_" + (i + 1) + "' >" +
                    "<div class='container'>" +
                    "<label><b>Sala de ensayo " + (i + 1) + "</b></label>" +
                    "<div class='form-row'>" +
                    "<div class='col-lg-4'>" +
                    "<label>Foto Sala</label>" +
                    "<div id='custom-file'>" +
                    "<input type='file' id='fotoSala" + nombreEmpresaTrim + "_" + (i + 1) + "' lang='es'  accept='image/*'  style='font-size: 14px;' onchange='agregarUrlImagenSalas(" + i + "," + numbreEmpresaString + ")' >" +
                    "<div id='imagenB64Sala" + (i + 1) + "'></div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='col-lg-4'>" +
                    "<label>Nombre Sala</label>" +
                    "<input type='text' class='form-control' id='nombreSala" + nombreEmpresaTrim + "_" + (i + 1) + "' placeholder='Nombre de la sala' required>" +
                    "<div class='invalid-feedback'>Por favor llene este campo.</div>" +
                    "</div>" +
                    "<div class='col-lg-4'>" +
                    "<label>Capacidad Sala</label>" +
                    "<input type='number' class='form-control' id='capacidadSala" + nombreEmpresaTrim + "_" + (i + 1) + "' placeholder='Capacidad en numero de la sala' required>" +
                    "<div class='invalid-feedback'>Por favor llene este campo.</div>" +
                    "</div>" +
                    "</div>" +
                    "<br>" +
                    "<div class='form-row'>" +
                    "<div class='col-lg-4'>" +
                    "<label>Equipos Sala</label>" +
                    "<input type='text' class='form-control' id='equiposSala" + nombreEmpresaTrim + "_" + (i + 1) + "' placeholder='Equipos de la sala separados por coma' required>" +
                    "<div class='invalid-feedback'>Por favor llene este campo.</div>" +
                    "</div>" +
                    "<div class='col-lg-4'>" +
                    "<label>Precio por hora de alquiler</label>" +
                    "<input type='number' class='form-control' id='precioSala" + nombreEmpresaTrim + "_" + (i + 1) + "' placeholder='Precio' required>" +
                    "<div class='invalid-feedback'>Por favor llene este campo.</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</form>";
            $("#formularioSalasCreadas").append(formSalas);
        }
    } else {
        alert("Por favor digite solo numeros y valide el nombre de la empresa");
    }
}
function agregarUrlImagenSalas(i, nombreEmpresaTrim) {
    console.log((i + 1), nombreEmpresaTrim)
    imagenConvertB64(document.getElementById('fotoSala' + nombreEmpresaTrim + '_' + (i + 1)), 'imagenB64Sala' + (i + 1));
}
function agregarEmpresa() {
    let fotoEmpresa = $("#imagenB64fotoEmpresaAdd #file-preview").attr('src');
    let direccionEmpresa = $("#direccionEmpresaAdd").val();
    let horarioEmpresa = $("#horarioEmpresaAdd").val();
    let correoEmpresa = $("#correoEmpresaAdd").val();
    let logoEmpresa = $("#imagenB64logoEmpresaAdd #file-preview").attr('src');
    let servicios = {
        salaEnsayo: $("#checkboxSalasEnsayo").is(':checked'),
        djBooth: $("#checkboxDjBooth").is(':checked'),
        salaGrabacion: $("#checkboxSalasGrabacion").is(':checked'),
        backline: $("#checkboxBackline").is(':checked')
    };
    let resumenEmpresa = $("#resumenEmpresaAdd").val();
    let nombreEmpresa = $("#nombreEmpresaAdd").val().split(' ').join('_');
    let cantidadSalasEmpresa = $("#cantidadSalasEmpresa").val();
    let arrSalas = [];
    for (var i = 0; i < cantidadSalasEmpresa; i++) {
        let sala = {
            fotoSala: $('#imagenB64Sala' + (i + 1) + ' #file-preview').attr('src'),
            nombreSala: $("#nombreSala" + nombreEmpresa + "_" + (i + 1)).val(),
            capacidadSala: $("#capacidadSala" + nombreEmpresa + "_" + (i + 1)).val(),
            equiposSala: $("#equiposSala" + nombreEmpresa + "_" + (i + 1)).val(),
            precioSala: $("#precioSala" + nombreEmpresa + "_" + (i + 1)).val()
        };
        arrSalas.push(sala);
    }
    let validacion = 0;
    $.ajax({
        url: server + "Riff/app/restServices/crearEmpresa",
        type: "POST",
        data: JSON.stringify({
            fotoEmpresa: fotoEmpresa,
            direccion: direccionEmpresa,
            horarios: horarioEmpresa,
            correoElectronico: correoEmpresa,
            logoEmpresa: logoEmpresa,
            resumen: resumenEmpresa,
            nombreEmpresa: nombreEmpresa,
            cantidadSalas: cantidadSalasEmpresa,
            salasEmpresa: JSON.stringify(arrSalas),
            servicios: JSON.stringify(servicios)
        }),
        async: false,
        cache: false,
        contentType: "application/json",
        success: function (rta) {
            console.log("crearEmpresa", rta);
            if (rta.codigo === 1) {
                validacion = 1;
                innerModalInformativo("Creacion empresa", "Sé ha creado con éxito la empresa" + nombreEmpresa, "");
            } else {
                innerModalInformativo("<b>Error al consultar</b>", "Error al crear la empresas, consulte con el administrador", "");
            }
        },
        error: function () {
            innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
        }
    });

    if (validacion === 1) {
        for (var i = 0; i < cantidadSalasEmpresa; i++) {
            $.ajax({
                url: server + "Riff/app/restServices/crearSala",
                type: "POST",
                data: JSON.stringify({
                    nombreEmpresa: nombreEmpresa,
                    nombreSala: arrSalas[i].nombreSala,
                    capacidadPersonas: arrSalas[i].capacidadSala,
                    precioSalaHora: arrSalas[i].precioSala,
                    equipo: arrSalas[i].equiposSala
                }),
                async: false,
                cache: false,
                contentType: "application/json",
                success: function (rta) {
                    if (rta.codigo === 1) {
                        console.log("crearSala", rta);
                    } else {
                        innerModalInformativo("<b>Error al consultar</b>", "Error al crear la empresas, consulte con el administrador", "");
                    }
                },
                error: function () {
                    innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
                }
            });
        }
        accesolistadoSalasEnsayo();
    }
}

// FUNCIONALIDADES SITIOS  -----------------------------------------------------------------------------------------
function envioFormularioContacto(id) {
    let nombreContacto = $("#nombreContactenos" + id).val();
    let emailContacto = $("#emailContactenos" + id).val();
    let telefonoContacto = $("#telefonoContactenos" + id).val();
    let mensajeContacto = $("#cajaMensajeContactenos" + id).val();
    if (nombreContacto !== '' && emailContacto !== '' && telefonoContacto !== '' && mensajeContacto !== '') {
        $.ajax({
            url: "https://listener.yellowpush.com/YELLOWPUSH/TEST/Rest/SMSRiff/",
            data: JSON.stringify({
                telefono: telefonoContacto
            }),
            type: "POST",
            async: false,
            cache: false,
            contentType: "application/json",
            success: function (rta) {
                innerModalInformativo("SMS enviado",
                        rta.descripcion + ", en breve nos contactaremos.",
                        "", false);
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else {
        innerModalInformativo("<b>Informacion importante</b>", "Por favor llene todos los datos de contacto", "");
    }
}

// RESERAVS ACTIVAS E HISTORICO -----------------------------------------------------------------------------------------
function historicoReservas() {
    let idUsuario = JSON.parse(localStorage.getItem("dataUsuario")).id_usuario;
    $.ajax({
        url: server + "Riff/app/restServices/consultarHistoricoReservas",
        data: JSON.stringify({
            id_usuario: idUsuario
        }),
        type: "POST",
        async: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                if (rta.listaReservas.length > 0) {
                    let lista = rta.listaReservas;
                    var t = $('#tablaHistorico').DataTable({"language": {
                            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
                        }});
                    t.clear();
                    for (let i = 0; i < lista.length; i++) {
                        t.row.add([
                            lista[i].idReserva,
                            lista[i].fechaReserva,
                            lista[i].horaInicio.split("-")[0],
                            lista[i].horaFin.split("-")[0],
                            "$ " + lista[i].precio.precio.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                            lista[i].sala.nombreSala,
                            "Cueva de la Cebra"
                        ]).draw(true);
                    }
                } else {
                    alert("Usuario sin reservas para mostrar");
                }
            } else {
                alert("Error al consultar, consulte con el administrador.");
            }
        },
        error: function () {
            alert("Error en el sistema, consulte al administrador");
        }
    });
}
function reservasActivas() {
    let idUsuario = JSON.parse(localStorage.getItem("dataUsuario")).id_usuario;
    $.ajax({
        url: server + "Riff/app/restServices/consultarReservasActivas",
        data: JSON.stringify({
            id_usuario: idUsuario
        }),
        type: "POST",
        async: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                console.log(rta.listaReservas.length);
                if (rta.listaReservas.length > 0) {
                    let lista = rta.listaReservas;
                    var t = $('#tablaReservasActivas').DataTable({"language": {
                            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
                        }});
                    t.clear().draw();
                    for (let i = 0; i < lista.length; i++) {
                        t.row.add([
                            lista[i].idReserva,
                            lista[i].fechaReserva,
                            lista[i].horaInicio.split("-")[0],
                            lista[i].horaFin.split("-")[0],
                            "$ " + lista[i].precio.precio.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                            lista[i].sala.capacidadPersonas,
                            lista[i].sala.nombreSala,
                            "Cueva de la Cebra",
                            "<button style='width: 167px !important;' onclick='cancelarReservaActiva(this.id)' class='btn btn-danger' id='" + lista[i].fechaReserva + "/" +
                                    lista[i].horaInicio.split("-")[0] + "/" + lista[i].horaFin.split("-")[0] + "/" + lista[i].sala.nombreSala + "/" + lista[i].idReserva + "'><i class='fa fa-fw fa-x3 fa-times-circle'></i> Cancelar reserva</button>"
                        ]).draw(true);
                    }
                } else {
//                    var t = $('#tablaReservasActivas').DataTable({"language": {
//                            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
//                        }});
//                    t.clear().draw();
                    skip();
                    alert("Sin reservas a mostrar para el usaurio " + JSON.parse(localStorage.getItem("dataUsuario")).usuario);
                }
            } else {
                alert("Error al consultar, consulte con el administrador.");
            }
        },
        error: function () {
            alert("Error en el sistema, consulte al administrador");
        }
    });
}
function cancelarReservaActiva(id) {
    let idSala;
    switch (id.split("/")[3]) {
        case "BOHIO":
            idSala = 1;
            break;
        case "AMATISTA":
            idSala = 2;
            break;
        case "MILES":
            idSala = 3;
            break;
    }
    let idUsuario = JSON.parse(localStorage.getItem("dataUsuario")).id_usuario;
    $.ajax({
        url: server + "Riff/app/restServices/cancelarReservaActiva",
        data: JSON.stringify({
            fechaReserva: id.split("/")[0],
            horaInicio: id.split("/")[1],
            horaFin: id.split("/")[2],
            detalles: idSala + "/" + idUsuario,
            nombreEmpresa: "LA_CUEVA_DE_LA_CEBRA",
            idReserva: id.split("/")[4]
        }),
        type: "POST",
        async: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                innerModalInformativo("<b style='color: red;'>" + JSON.parse(rta.descripcion).descripcion + "</b>",
                        "La reserva: "
                        + "<br>* Sitio: <b>La cueva de la cebra</b>"
                        + "<br>* Nombre de la Sala: <b>" + id.split("/")[3] + "</b>"
                        + "<br>* hora de inicio: <b>" + id.split("/")[1] + "</b>"
                        + "<br>* hora de fin: <b>" + id.split("/")[2] + "</b>"
                        + "<br>ha sido cancelada.", "");
                reservasActivas();
            } else {
                alert("Error al cancelar la reserva");
            }
        },
        error: function () {
            alert("Error en el sistema, consulte al administrador");
        }
    });
}

// EDICION DATOS USAURIO --------------------------------------------------------------------------------------------
function verUsuarios() {
    $.ajax({
        url: server + "Riff/app/restServices/verUsuarios",
        type: "GET",
        async: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                if (rta.listaUsuarios.length > 0) {
                    let lista = rta.listaUsuarios;
                    var t = $('#tablaVerUsuarios').DataTable({"columns": [
                            null,
                            null,
                            {"width": "200px"},
                            null,
                            null,
                            null,
                            null
                        ], "language": {
                            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
                        }});
                    t.clear().draw();
                    for (let i = 0; i < lista.length; i++) {
                        t.row.add([
                            lista[i].id_usuario,
                            lista[i].usuario,
                            lista[i].nombre,
                            lista[i].rol,
                            lista[i].identificacion,
                            lista[i].correoElectronico,
                            "<button style='width: 45px !important;' onclick='editarUsuario(this.id)' class='btn btn-success' id='" + lista[i].id_usuario + "//" + lista[i].usuario + "'><i class='fa fa-fw fa-x3 fa-user'></i></button>"
                        ]).draw(true);
                    }
                } else {
                    var t = $('#tablaReservasActivas').DataTable({"language": {
                            "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
                        }});
                    t.clear().draw();
                    skip();
                    alert("Sin reservas a mostrar para el usaurio " + JSON.parse(localStorage.getItem("dataUsuario")).usuario);
                }
                $("#modalVerUsuarios").modal("show");
            } else {
                innerModalInformativo("Oops algo ha ocurrido", "Error al consultar los usuarios", "");
            }
        },
        error: function () {
            innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
        }
    });
}
function editarUsuario(id) {
    $.ajax({
        url: server + "Riff/app/restServices/verUsuarios",
        type: "GET",
        async: false,
        contentType: "application/json",
        success: function (rta) {
            let rolUsuario;
            if (rta.codigo === 1) {
                let datosUsuario;
                for (var i = 0; i < rta.listaUsuarios.length; i++) {
                    if (Number(rta.listaUsuarios[i].id_usuario) === Number(id.split("//")[0])) {
                        datosUsuario = rta.listaUsuarios[i];
                    }
                }
                $("#usuarioModificacion").text(id.split("//")[1]);
                $("#identificacionUsuario").val(datosUsuario.identificacion);
                $("#nombresUsuario").val(datosUsuario.nombre);
                $("#apellidosUsuario").val(datosUsuario.apellido);
                $("#direccionUsuario").val(datosUsuario.direccionResidencia);
                $("#telefonoUsuario").val(datosUsuario.telefono);
                $("#correoUsuario").val(datosUsuario.correoElectronico);
                switch (datosUsuario.rol) {
                    case "1":
                        rolUsuario = "Usuario estándar";
                        break;
                    case "2":
                        rolUsuario = "Administrador";
                        break;
                }
                $("#rolUsuario").val(rolUsuario);
                if (datosUsuario.activo === "1") {
                    $("#activoCheckbox").attr("checked", true);
                } else {
                    $("#activoCheckbox").attr("checked", false);
                }
                $("#modalVerUsuarios").modal("hide");
                $("#modalEdicionDatosUsuario").modal("show");
            } else {
                innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
            }
        },
        error: function () {
            innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
        }
    });
}
function actualizarDatosUsuario() {
    let usuarioActivo;
    let claveUsuario = "";
    if ($("#activoCheckbox").is(':checked')) {
        usuarioActivo = 1;
    } else {
        usuarioActivo = 0;
    }
    if ($("#claveUsuario").val() !== "") {
        claveUsuario = getSha256($("#claveUsuario").val());
    }
    let datosUsuario = {
        identificacion: $("#identificacionUsuario").val(),
        usuario: $("#usuarioModificacion").text(),
        nombre: $("#nombresUsuario").val(),
        apellido: $("#apellidosUsuario").val(),
        direccionResidencia: $("#direccionUsuario").val(),
        telefono: $("#telefonoUsuario").val(),
        correoElectronico: $("#correoUsuario").val(),
        rol: $("#rolUsuario").val(),
        activo: usuarioActivo,
        clave: claveUsuario
    };
    $.ajax({
        url: server + "Riff/app/restServices/actualizarDatosUsuario",
        data: JSON.stringify(datosUsuario),
        type: "POST",
        async: false,
        cache: false,
        contentType: "application/json",
        success: function (rta) {
            if (rta.codigo === 1) {
                innerModalInformativo("Actualización de datos", "Se actualizaron los datos del usuario " + datosUsuario.usuario, "");
                $("#modalEdicionDatosUsuario").modal("hide");
                document.getElementById('formularioEdicionUsuario').reset();
            } else {
                innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador <br> " + rta.descripcionError, "");
            }
        },
        error: function () {
            innerModalInformativo("Oops algo ha ocurrido", "Error en el sistema, consulte al administrador", "");
        }
    });

}