// ─── Exportar datos a Excel ────────────────────────────────────

// Cargar la librería SheetJS desde CDN
async function cargarSheetJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ─── Exportar Habitaciones ─────────────────────────────────────
export async function fnExportarHabitaciones() {
    const XLSX = await cargarSheetJS();
    const habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || [];

    if (habitaciones.length === 0) {
        alert('No hay habitaciones para exportar.');
        return;
    }

    const datos = habitaciones.map(h => ({
        'N° Habitación': h.id,
        'Tipo': h.tipo,
        'Capacidad': `${h.capacidad} ${h.capacidad === 1 ? 'persona' : 'personas'}`,
        'Descripción': h.descripcion || '—',
        'Baño': h.bano || '—'
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Habitaciones');
    XLSX.writeFile(wb, `Habitaciones_${new Date().toISOString().split('T')[0]}.xlsx`);
    alert('✅ Habitaciones exportadas correctamente.');
}

// ─── Exportar Clientes ─────────────────────────────────────────
export async function fnExportarClientes() {
    const XLSX = await cargarSheetJS();
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    if (clientes.length === 0) {
        alert('No hay clientes para exportar.');
        return;
    }

    const datos = clientes.map(c => ({
        'DNI': c.dni,
        'Nombre': c.nombre,
        'Apellido': c.apellido,
        'Nacionalidad': c.nacionalidad || '—',
        'Email': c.email,
        'Teléfono': c.telefono,
        'Dirección': c.direccion || '—'
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, `Clientes_${new Date().toISOString().split('T')[0]}.xlsx`);
    alert('✅ Clientes exportados correctamente.');
}

// ─── Exportar Reservas ────────────────────────────────────────
export async function fnExportarReservas() {
    const XLSX = await cargarSheetJS();
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    if (reservas.length === 0) {
        alert('No hay reservas para exportar.');
        return;
    }

    const datos = reservas.map(r => {
        const cliente = clientes.find(c => c.dni === r.dniCliente);
        const noches = r.fechaIngreso && r.fechaEgreso
            ? Math.round((new Date(r.fechaEgreso) - new Date(r.fechaIngreso)) / 86400000)
            : '—';

        return {
            'Habitación': r.habitacion,
            'Cliente': cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A',
            'DNI Cliente': r.dniCliente,
            'Fecha Ingreso': formatDate(r.fechaIngreso),
            'Fecha Egreso': formatDate(r.fechaEgreso),
            'Noches': noches,
            'Cantidad Personas': r.cantPersonas,
            'Estado': r.estado.charAt(0).toUpperCase() + r.estado.slice(1)
        };
    });

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
    XLSX.writeFile(wb, `Reservas_${new Date().toISOString().split('T')[0]}.xlsx`);
    alert('✅ Reservas exportadas correctamente.');
}

// ─── Exportar TODO en un único archivo con múltiples hojas ─────
export async function fnExportarTodo() {
    const XLSX = await cargarSheetJS();
    const habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    if (habitaciones.length === 0 && clientes.length === 0 && reservas.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const wb = XLSX.utils.book_new();

    // Hoja de Habitaciones
    if (habitaciones.length > 0) {
        const datosHab = habitaciones.map(h => ({
            'N° Habitación': h.id,
            'Tipo': h.tipo,
            'Capacidad': `${h.capacidad} ${h.capacidad === 1 ? 'persona' : 'personas'}`,
            'Descripción': h.descripcion || '—',
            'Baño': h.bano || '—'
        }));
        const wsHab = XLSX.utils.json_to_sheet(datosHab);
        XLSX.utils.book_append_sheet(wb, wsHab, 'Habitaciones');
    }

    // Hoja de Clientes
    if (clientes.length > 0) {
        const datosClientes = clientes.map(c => ({
            'DNI': c.dni,
            'Nombre': c.nombre,
            'Apellido': c.apellido,
            'Nacionalidad': c.nacionalidad || '—',
            'Email': c.email,
            'Teléfono': c.telefono,
            'Dirección': c.direccion || '—'
        }));
        const wsClientes = XLSX.utils.json_to_sheet(datosClientes);
        XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');
    }

    // Hoja de Reservas
    if (reservas.length > 0) {
        const datosReservas = reservas.map(r => {
            const cliente = clientes.find(c => c.dni === r.dniCliente);
            const noches = r.fechaIngreso && r.fechaEgreso
                ? Math.round((new Date(r.fechaEgreso) - new Date(r.fechaIngreso)) / 86400000)
                : '—';

            return {
                'Habitación': r.habitacion,
                'Cliente': cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A',
                'DNI Cliente': r.dniCliente,
                'Fecha Ingreso': formatDate(r.fechaIngreso),
                'Fecha Egreso': formatDate(r.fechaEgreso),
                'Noches': noches,
                'Cantidad Personas': r.cantPersonas,
                'Estado': r.estado.charAt(0).toUpperCase() + r.estado.slice(1)
            };
        });
        const wsReservas = XLSX.utils.json_to_sheet(datosReservas);
        XLSX.utils.book_append_sheet(wb, wsReservas, 'Reservas');
    }

    XLSX.writeFile(wb, `Hostel_Datos_${new Date().toISOString().split('T')[0]}.xlsx`);
    alert('✅ Todos los datos exportados correctamente.');
}

// Helper: formatear fecha (reutilizado de visualizaciones.js)
function formatDate(str) {
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return d && m && y ? `${d}/${m}/${y}` : str;
}
