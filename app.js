import { fnLogin             } from "./login.js";
import { fnRegistrarHabitacion } from "./registrarHabitacion.js";
import { fnRegistrarCliente    } from "./registrarCliente.js";

// ─── Admins ───────────────────────────────────────────────
const admins = [
    { usuario: "kevin",   clave: "sa"      },
    { usuario: "micaela", clave: "micaela" },
    { usuario: "jimena",  clave: "jimena"  },
    { usuario: "cielo",   clave: "cielo"   },
    { usuario: "lucas",   clave: "lucas"   }
];

// ─── Helpers de navegación ────────────────────────────────

function fnMostrar(idSeccion) {
    document.getElementById(idSeccion).style.display = "block";
}

function fnOcultar(idSeccion) {
    document.getElementById(idSeccion).style.display = "none";
}

function fnIrA(destino) {
    fnOcultar("secMenu");
    fnMostrar(destino);
}

function fnVolver(origen) {
    fnOcultar(origen);
    fnMostrar("secMenu");
}

// ─── Login ────────────────────────────────────────────────
document
    .getElementById("btnAgregar")
    .addEventListener("click", () => fnLogin(admins));

// ─── Botones del menú ─────────────────────────────────────
/*document
    .getElementById("btnIrRegistrarCliente")
    .addEventListener("click", () => fnIrA("secRegistrarCliente"));*/
document
    .getElementById("btnIrRegistrarCliente")
    .addEventListener("click", () => {
        // Limpiar al abrir, no al cerrar
        ["txtNombreClnte","txtApellidoClnte","txtDNIClnte",
         "txtEmailClnte","txtNroTelClnte","txtDireccionClnte"]
            .forEach(id => document.getElementById(id).value = "");
        fnIrA("secRegistrarCliente");
    });

document
    .getElementById("btnIrRegistrarReserva")
    .addEventListener("click", () => fnIrA("secReserva"));

document
    .getElementById("btnIrRegistrarHabitacion")
    .addEventListener("click", () => fnIrA("secRegistrarHabitacion"));

document
    .getElementById("btnVerHabitaciones")
    .addEventListener("click", () => fnIrA("secListaHabitaciones"));

document
    .getElementById("btnVerClientes")
    .addEventListener("click", () => fnIrA("secListaClientes"));

document
    .getElementById("btnVerReservas")
    .addEventListener("click", () => fnIrA("secListaReservas"));

// ─── Botones "Volver" ─────────────────────────────────────
document
    .getElementById("btnVolverReserva")
    .addEventListener("click", () => fnVolver("secReserva"));

document
    .getElementById("btnVolverCliente")
    .addEventListener("click", () => fnVolver("secRegistrarCliente"));

document
    .getElementById("btnVolverHabitacion")
    .addEventListener("click", () => fnVolver("secRegistrarHabitacion"));

document
    .getElementById("btnVolverListaHabitaciones")
    .addEventListener("click", () => fnVolver("secListaHabitaciones"));

document
    .getElementById("btnVolverListaClientes")
    .addEventListener("click", () => fnVolver("secListaClientes"));

document
    .getElementById("btnVolverListaReservas")
    .addEventListener("click", () => fnVolver("secListaReservas"));

// ─── Botones "Registrar" ──────────────────────────────────
document
    .getElementById("btnEnviarReserva")
    .addEventListener("click", () => fnRegistrarReserva());          // pendiente

document
    .getElementById("btnEnviarCliente")
    .addEventListener("click", () => fnRegistrarCliente(fnVolver));

document
    .getElementById("btnEnviarHabitacion")
    .addEventListener("click", () => fnRegistrarHabitacion(fnVolver));
