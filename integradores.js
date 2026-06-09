// ─── Importar funciones de exportación ────────────────────────
import { fnExportarHabitaciones, fnExportarClientes, fnExportarReservas, fnExportarTodo } from './exportar.js';

// ─── Event listeners para botones de exportación ────────────────
export function configurarExportadores() {
    const btnExportarHabitaciones = document.getElementById('btnExportarHabitaciones');
    const btnExportarClientes = document.getElementById('btnExportarClientes');
    const btnExportarReservas = document.getElementById('btnExportarReservas');
    const btnExportarTodo = document.getElementById('btnExportarTodo');

    if (btnExportarHabitaciones) {
        btnExportarHabitaciones.addEventListener('click', () => {
            fnExportarHabitaciones();
        });
    }

    if (btnExportarClientes) {
        btnExportarClientes.addEventListener('click', () => {
            fnExportarClientes();
        });
    }

    if (btnExportarReservas) {
        btnExportarReservas.addEventListener('click', () => {
            fnExportarReservas();
        });
    }

    if (btnExportarTodo) {
        btnExportarTodo.addEventListener('click', () => {
            fnExportarTodo();
        });
    }
}
