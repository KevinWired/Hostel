import { fnLogin } from "./login.js";
import { fnRegistrarHabitacion } from "./registrarHabitacion.js";
import { fnRegistrarCliente } from "./registrarCliente.js";
import { fnRegistrarReserva, fnInicializarFechas, cargarHabitacionesEnSelect } from "./registrarReserva.js";
import { fnMostrarHabitaciones, fnMostrarClientes, fnMostrarReservas } from "./visualizaciones.js";
import { initNacionalidadListener, limpiarCamposCliente } from './validaciones.js';


// ─── Inicialización ───────────────────────────────────────
// Inicializar el listener del select de nacionalidad
initNacionalidadListener();

console.log("Sistema de Hostel iniciado correctamente");

// ─── Admins ───────────────────────────────────────────────
const admins = [
    { usuario: "kevin",   clave: "sa",      nombre: "Kevin" },
    { usuario: "micaela", clave: "micaela", nombre: "Micaela" },
    { usuario: "jimena",  clave: "jimena",  nombre: "Jimena" },
    { usuario: "cielo",   clave: "cielo",   nombre: "Cielo" },
    { usuario: "lucas",   clave: "lucas",   nombre: "Lucas" }
];

let usuarioActual = null;

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
function fnLogout() {
    usuarioActual = null;
    document.getElementById("userInfo").style.display = "none";
    fnOcultar("secMenu");
    fnMostrar("secLogin");
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtClave").value = "";
}

// ─── Login ────────────────────────────────────────────────
document.getElementById("btnAgregar").addEventListener("click", () => {
    const result = fnLogin(admins);
    if (result) {
        usuarioActual = result;
        document.getElementById("userName").innerText = result.nombre;
        document.getElementById("userInfo").style.display = "flex";
    }
});

document.getElementById("btnLogout").addEventListener("click", fnLogout);

// ─── Botones del menú ─────────────────────────────────────
document.getElementById("btnIrRegistrarCliente").addEventListener("click", () => {
    // Limpiar campos al abrir
    ["txtNombreClnte", "txtApellidoClnte", "txtDNIClnte",
     "txtEmailClnte", "txtNroTelClnte", "txtDireccionClnte"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    fnIrA("secRegistrarCliente");
});

document.getElementById("btnIrRegistrarReserva").addEventListener("click", () => {
    cargarHabitacionesEnSelect();
    fnInicializarFechas();
    fnIrA("secReserva");
});

document.getElementById("btnIrRegistrarHabitacion").addEventListener("click", () => {
    fnIrA("secRegistrarHabitacion");
});

document.getElementById("btnVerHabitaciones").addEventListener("click", () => {
    fnMostrarHabitaciones();
    fnIrA("secListaHabitaciones");
});

document.getElementById("btnVerClientes").addEventListener("click", () => {
    fnMostrarClientes();
    fnIrA("secListaClientes");
});

document.getElementById("btnVerReservas").addEventListener("click", () => {
    fnMostrarReservas();
    fnIrA("secListaReservas");
});

// ─── Botones "Volver" ─────────────────────────────────────
document.getElementById("btnVolverReserva").addEventListener("click", () => fnVolver("secReserva"));
document.getElementById("btnVolverCliente").addEventListener("click", () => fnVolver("secRegistrarCliente"));
document.getElementById("btnVolverHabitacion").addEventListener("click", () => fnVolver("secRegistrarHabitacion"));
document.getElementById("btnVolverListaHabitaciones").addEventListener("click", () => fnVolver("secListaHabitaciones"));
document.getElementById("btnVolverListaClientes").addEventListener("click", () => fnVolver("secListaClientes"));
document.getElementById("btnVolverListaReservas").addEventListener("click", () => fnVolver("secListaReservas"));

// ─── Botones "Registrar" ──────────────────────────────────
document.getElementById("btnEnviarReserva").addEventListener("click", () => {
    fnRegistrarReserva();
    cargarHabitacionesEnSelect(); // Recargar select después de registrar
});

document.getElementById("btnEnviarCliente").addEventListener("click", () => fnRegistrarCliente(fnVolver));
document.getElementById("btnEnviarHabitacion").addEventListener("click", () => fnRegistrarHabitacion(fnVolver));

// ─── Inicialización ───────────────────────────────────────
console.log("Sistema de Hostel iniciado correctamente");