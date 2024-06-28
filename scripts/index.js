let HORARIO_INGRESADO = null;
let DURACION_RESERVA = null;
let HORARIO_APERTURA = null;
let HORARIO_CIERRE = null;
let CONFIGURACION = true;
let DIAS = [];
let TURNOS = [];
let DURACION_GUARDADA = false;
let DATOS = [];
let ID_AUX = null;


function guardarHoriarioApertura() {
    if ((CONFIGURACION == true) && (DURACION_GUARDADA)){
        let inputApertura = document.getElementById("apertura");
        let inputCierre = document.getElementById("cierre");
        HORARIO_APERTURA = parseInt(inputApertura.value);
        HORARIO_CIERRE = parseInt(inputCierre.value);
        HORARIO_INGRESADO = [HORARIO_APERTURA, HORARIO_CIERRE];
        mostrarHorario();
    } else if (DURACION_GUARDADA == false) {
        alert("Debe confirmar la duracion primero");
    } else {
        alert("Las configuracions han sido bloqueadas");
    }        
}

function guardarDuracion() {
    let selectDuracion = document.getElementById("duracionReserva");
    if (CONFIGURACION == true){
        DURACION_RESERVA = parseInt(selectDuracion.value);
        let spanDuracion = document.getElementById("mostrarDuracion");
        spanDuracion.innerHTML = DURACION_RESERVA;
        DURACION_GUARDADA = true;
    } else {
        selectDuracion.setAttribute("disabled", "true");
        alert("La configuracion ha sido bloqueada");
    }
  
    
}

function mostrarHorario() {
    let spanApertura = document.getElementById("horaApertura");
    let spanCierre = document.getElementById("horaCierre");
    spanApertura.innerHTML = HORARIO_APERTURA;
    spanCierre.innerHTML = HORARIO_CIERRE;
}

function alCargarPagina() {
    let hoy = new Date();
    DIAS = siguientes15dias(hoy);
    let botonCandado = document.getElementById("botonCandado").addEventListener("click", onCickCandado);
    let botonHorario = document.getElementById("aceptarHorario").addEventListener("click", guardarHoriarioApertura);
    let selectDuracion = document.getElementById("duracionReserva").addEventListener("change", guardarDuracion);
        
    setEncabezados();
    
}

function onCickCandado() {
    if (CONFIGURACION) {
        CONFIGURACION = false;
        setHorarios();
        setBotonesAniadir();
        setBotonesCancelar();
    } else {
        corregirValores();
    }        
}

function unDiaMas(fecha) {
    let dia = new Date (fecha);
    return new Date(dia.setDate(dia.getDate() + 1))
}

function siguientes15dias (hoy) {
    let dias = [];
    let diaActual = hoy;
    let diaAux = "";
    for (let i = 0; i < 15; i++){
        diaAux = `${diaActual.getDate()}/${(diaActual.getMonth()) + 1}/${diaActual.getFullYear()}`;
        dias.push(diaAux);
        diaActual = unDiaMas(diaActual);
    }
    return dias
}

function storageObtenerFecha() {
    let selector = document.getElementById("fecha");
    let fecha = selector.options[selector.selectedIndex];
    fecha = fecha.innerText;
    let reserva = localStorage.getItem(fecha);
    return reserva
}

function cantidadDeTurnos() {
    return parseInt((HORARIO_CIERRE - HORARIO_APERTURA) / DURACION_RESERVA)
}

function corregirValores() {
    CONFIGURACION = true;
    
    let selectDuracion = document.getElementById("duracionReserva");
    selectDuracion.removeAttribute("disabled");

}

function setEncabezados() {
    let contEncabezados = document.getElementById("encabezados");
    for (let dia of DIAS) {
        let encabezado = document.createElement("th");
        encabezado.innerHTML = dia; 
        contEncabezados.append(encabezado);
    }

}

function setHorarios() {
    let contHorarios = document.getElementById("cuerpoTabla");
    let cantTurnos = cantidadDeTurnos();
    TURNOS = horas(cantTurnos);
    for (let horaFila of TURNOS) {
        let primero = document.createElement("tr");
        primero.innerHTML = `${horaFila} : 00`;
        primero.setAttribute("id", horaFila);
        contHorarios.appendChild(primero);
    }

    for (let hora1 of TURNOS) {
        for (let dia2 of DIAS){
            crearFila(hora1, `${dia2}_${hora1}`, dia2);
        }
    }

    
}

function crearFila(horario, id1, fecha) {
    let filahorario = document.getElementById(horario);
    
    let colEstado = document.createElement("td");
    let reserva = enStorage(id1);
    if (reserva == true) {
        let nombre = localStorage.getItem(id1);
        colEstado.innerHTML = nombre;

        let botonCancelar = document.createElement("button");
        botonCancelar.innerHTML = "Cancelar";
        botonCancelar.setAttribute("data-id", `${id1}`);
        botonCancelar.setAttribute("class", "botonesCancelar");
        botonCancelar.style.background = "transparent";
        botonCancelar.style.border = "none";
        colEstado.appendChild(botonCancelar);
        colEstado.style.backgroundColor = "red";

    } else {
        const nuevoId = `${fecha}_${horario}`;
        let botonReservar = document.createElement("button");
        botonReservar.innerHTML = "Reservar";
        botonReservar.setAttribute("data-id", nuevoId);
        botonReservar.setAttribute("class", "botonReservar");
        colEstado.appendChild(botonReservar);
    }
    filahorario.appendChild(colEstado);
}

function enStorage(id) {
    let resultado = localStorage.getItem(id)
    if (resultado == null){
        return false
    } else {
        return true
    }
     
}

function horas(cantTurnos) {
    let horarios = [];
    let horaAux = HORARIO_APERTURA;
    for (let j = 0; j < cantTurnos; j++){
        horarios.push(horaAux);
        horaAux = horaAux + DURACION_RESERVA;
    }
    return horarios
}

function borrarAyer(){
    let ayer = new Date();
    ayer = new Date(ayer.setDate(ayer.getDate() - 1))
    ayer = `${ayer.getDay()}/${ayer.getMonth()}/${ayer.getFullYear()}`;
    console.log(ayer);
    let reservas = localStorage.getItem()
}

function onClickReservar(id2) {
    let form1 = document.getElementById("formReservas");
    form1.style.display = "block";
    let DATOS = [];
    ID_AUX = id2;

    let botonAceptar = document.getElementById("aniadirReserva");
    botonAceptar.addEventListener("click", onClickAceptar);

}

function onClickCancelar(id2) {
    borrarReserva(id2);
    actualizarGrilla();
}

function borrarReserva(id) {
    localStorage.removeItem(id);

}

function onClickAceptar() {
    let formNombre = document.getElementById("nombre");
    let formContacto = document.getElementById("contacto");
    formNombre = formNombre.value;
    formContacto = formContacto.value;
    DATOS = [formNombre, formContacto];
    aniadirReservaStorage(ID_AUX, DATOS[0], DATOS[1]);
    actualizarGrilla(); 
    reSetForm();
    let form = document.getElementById("formReservas");
    form.style.display= "none";
    setBotonesAniadir();
    setBotonesCancelar();
}

function reSetForm() {
    let formNombre = document.getElementById("nombre");
    let formContacto = document.getElementById("contacto");
    formNombre.value = "";
    formContacto.value ="";
}

function setBotonesAniadir() {
    let botonesReservar = document.querySelectorAll('.botonReservar');
    botonesReservar.forEach(boton => {
        let idBoton = boton.getAttribute("data-id");
        boton.addEventListener("click", function(event){
            onClickReservar(idBoton);
        });
    });
}

function setBotonesCancelar() {
    let botonesCancelar = document.querySelectorAll('.botonesCancelar');
    botonesCancelar.forEach(botonCan => {
        let idboton1 = botonCan.getAttribute("data-id");
        botonCan.addEventListener("click", function(event){
            onClickCancelar(idboton1);
        })
    })
}

function aniadirReservaStorage(id, nombre, contacto) {
    localStorage.setItem(`${id}`, `${nombre} - ${contacto}`);
}

function actualizarGrilla() {
    let tabla = document.getElementById("cuerpoTabla");
    tabla.innerHTML = "";
    setHorarios();
    setBotonesAniadir();
    setBotonesCancelar();
}

document.addEventListener("DOMContentLoaded", alCargarPagina); 
