import { fnLogin } from "./login.js";
import { fnRegistrarHabitacion, initHabitacionAutoComplete } from "./registrarHabitacion.js";
import { fnRegistrarCliente } from "./registrarCliente.js";
import { fnRegistrarReserva, fnInicializarFechas, cargarHabitacionesEnSelect } from "./registrarReserva.js";
import { fnMostrarHabitaciones, fnMostrarClientes, fnMostrarReservas } from "./visualizaciones.js";
import { initNacionalidadListener, limpiarCamposCliente } from './validaciones.js';

// ─── Inicialización de listeners ──────────────────────────
initHabitacionAutoComplete();
initNacionalidadListener();

console.log("Sistema de Hostel iniciado correctamente");

// ─── Admins ───────────────────────────────────────────────
const admins = [
    { usuario: "kevin",   clave: "sa",      nombre: "Kevin" },
    { usuario: "cielo",   clave: "cielo",   nombre: "Cielo" },
    { usuario: "lucas",   clave: "lucas",   nombre: "Lucas" }
];

let usuarioActual = null;

// ─── Lista de todas las secciones del sistema ────────────
// Al hacer logout se ocultan TODAS para no dejar ninguna visible
const TODAS_LAS_SECCIONES = [
    "secMenu",
    "secRegistrarCliente",
    "secRegistrarHabitacion",
    "secReserva",
    "secListaHabitaciones",
    "secListaClientes",
    "secListaReservas"
];

// ─── Helpers de navegación ────────────────────────────────
function fnMostrar(idSeccion) {
    const el = document.getElementById(idSeccion);
    if (el) el.style.display = "block";
}

function fnOcultar(idSeccion) {
    const el = document.getElementById(idSeccion);
    if (el) el.style.display = "none";
}

function fnIrA(destino) {
    fnOcultar("secMenu");
    fnMostrar(destino);
}

function fnVolver(origen) {
    fnOcultar(origen);
    fnMostrar("secMenu");
}

// ─── Logout ───────────────────────────────────────────────
// Bug corregido: se ocultan TODAS las secciones antes de mostrar
// el login, para evitar que quede visible la sección que el usuario
// tenía abierta al momento de hacer logout.
function fnLogout() {
    usuarioActual = null;

    // Ocultar todas las secciones del sistema
    TODAS_LAS_SECCIONES.forEach(fnOcultar);

    // Ocultar userInfo y mostrar login
    document.getElementById("userInfo").style.display = "none";
    fnMostrar("secLogin");
    document.body.classList.add("modo-login");

    // Limpiar credenciales
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtClave").value = "";
    document.getElementById("txtUsuario").classList.remove("input-error");
    document.getElementById("txtClave").classList.remove("input-error");
    const loginFeedback = document.getElementById("loginFeedback");
    if (loginFeedback) {
        loginFeedback.textContent = "";
        loginFeedback.classList.remove("login-feedback--error");
    }
}

// ─── Login ────────────────────────────────────────────────
const btnAgregar = document.getElementById("btnAgregar");
if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
        const result = fnLogin(admins);
        if (result) {
            usuarioActual = result;
            document.getElementById("userName").innerText = result.nombre;
            document.getElementById("userInfo").style.display = "flex";
            document.body.classList.remove("modo-login");
        }
    });
}

["txtUsuario", "txtClave"].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", () => {
        input.classList.remove("input-error");
        const loginFeedback = document.getElementById("loginFeedback");
        if (loginFeedback) {
            loginFeedback.textContent = "";
            loginFeedback.classList.remove("login-feedback--error");
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && btnAgregar) {
            btnAgregar.click();
        }
    });
});

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", fnLogout);
}

// ─── Botones del menú ─────────────────────────────────────
const btnIrRegistrarCliente = document.getElementById("btnIrRegistrarCliente");
if (btnIrRegistrarCliente) {
    btnIrRegistrarCliente.addEventListener("click", () => {
        limpiarCamposCliente();
        fnIrA("secRegistrarCliente");
    });
}

const btnIrRegistrarReserva = document.getElementById("btnIrRegistrarReserva");
if (btnIrRegistrarReserva) {
    btnIrRegistrarReserva.addEventListener("click", () => {
        cargarHabitacionesEnSelect();
        fnInicializarFechas();
        fnIrA("secReserva");
    });
}

const btnIrRegistrarHabitacion = document.getElementById("btnIrRegistrarHabitacion");
if (btnIrRegistrarHabitacion) {
    btnIrRegistrarHabitacion.addEventListener("click", () => {
        fnIrA("secRegistrarHabitacion");
    });
}

const btnVerHabitaciones = document.getElementById("btnVerHabitaciones");
if (btnVerHabitaciones) {
    btnVerHabitaciones.addEventListener("click", () => {
        fnMostrarHabitaciones();
        fnIrA("secListaHabitaciones");
    });
}

const btnVerClientes = document.getElementById("btnVerClientes");
if (btnVerClientes) {
    btnVerClientes.addEventListener("click", () => {
        fnMostrarClientes();
        fnIrA("secListaClientes");
    });
}

const btnVerReservas = document.getElementById("btnVerReservas");
if (btnVerReservas) {
    btnVerReservas.addEventListener("click", () => {
        fnMostrarReservas();
        fnIrA("secListaReservas");
    });
}

// ─── Botones "Volver" ─────────────────────────────────────
const volverReserva = document.getElementById("btnVolverReserva");
if (volverReserva) volverReserva.addEventListener("click", () => fnVolver("secReserva"));

const volverCliente = document.getElementById("btnVolverCliente");
if (volverCliente) volverCliente.addEventListener("click", () => fnVolver("secRegistrarCliente"));

const volverHabitacion = document.getElementById("btnVolverHabitacion");
if (volverHabitacion) volverHabitacion.addEventListener("click", () => fnVolver("secRegistrarHabitacion"));

const volverListaHabitaciones = document.getElementById("btnVolverListaHabitaciones");
if (volverListaHabitaciones) volverListaHabitaciones.addEventListener("click", () => fnVolver("secListaHabitaciones"));

const volverListaClientes = document.getElementById("btnVolverListaClientes");
if (volverListaClientes) volverListaClientes.addEventListener("click", () => fnVolver("secListaClientes"));

const volverListaReservas = document.getElementById("btnVolverListaReservas");
if (volverListaReservas) volverListaReservas.addEventListener("click", () => fnVolver("secListaReservas"));

// ─── Botones "Registrar" ──────────────────────────────────
const btnEnviarReserva = document.getElementById("btnEnviarReserva");
if (btnEnviarReserva) {
    btnEnviarReserva.addEventListener("click", () => {
        fnRegistrarReserva();
        cargarHabitacionesEnSelect();
    });
}

const btnEnviarCliente = document.getElementById("btnEnviarCliente");
if (btnEnviarCliente) {
    btnEnviarCliente.addEventListener("click", () => fnRegistrarCliente(fnVolver));
}

// Bug corregido: se pasa cargarHabitacionesEnSelect como parámetro
// para que registrarHabitacion.js pueda recargar el select sin
// necesidad de acceder a window (que nunca funcionaba).
const btnEnviarHabitacion = document.getElementById("btnEnviarHabitacion");
if (btnEnviarHabitacion) {
    btnEnviarHabitacion.addEventListener("click", () => 
        fnRegistrarHabitacion(fnVolver, cargarHabitacionesEnSelect)
    );
}

console.log("✅ Todos los event listeners fueron inicializados correctamente");
