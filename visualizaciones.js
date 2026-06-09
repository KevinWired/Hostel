// ─── Helpers de formato ────────────────────────────────────────

function iniciales(nombre, apellido) {
    return ((nombre?.[0] || '') + (apellido?.[0] || '')).toUpperCase();
}

function formatDate(str) {
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return d && m && y ? `${d}/${m}/${y}` : str;
}

// Bug corregido: parseFechaLocal evita el desplazamiento UTC-3
// que hacía que new Date("YYYY-MM-DD") devolviera el día anterior.
function parseFechaLocal(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function emptyState(icon, msg) {
    return `<div class="empty-state">
        <i class="fas fa-${icon}"></i>
        <p>${msg}</p>
    </div>`;
}

// ─── Eliminar habitación (con validación de reservas) ─────────
export function fnEliminarHabitacion(idHabitacion) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reservasActivas = reservas.filter(r =>
        r.habitacion === idHabitacion && r.estado !== 'cancelada'
    );

    if (reservasActivas.length > 0) {
        alert(`⚠️ No se puede eliminar la habitación ${idHabitacion} porque tiene ${reservasActivas.length} reserva(s) activa(s).\n\n` +
              `Primero cancelá o eliminá las reservas asociadas.`);
        return;
    }

    if (confirm(`¿Estás seguro de que querés eliminar la habitación ${idHabitacion}?\n\nEsta acción no se puede deshacer.`)) {
        let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
        const habitacionEliminada = habitaciones.find(h => h.id === idHabitacion);

        if (habitacionEliminada) {
            habitaciones = habitaciones.filter(h => h.id !== idHabitacion);
            localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
            alert(`✅ Habitación ${idHabitacion} (${habitacionEliminada.tipo}) eliminada correctamente.`);
            fnMostrarHabitaciones();
        } else {
            alert('No se encontró la habitación.');
        }
    }
}

// ─── Habitaciones ─────────────────────────────────────────────
export function fnMostrarHabitaciones() {
    const habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || [];
    const container    = document.getElementById('listaHabitaciones');

    if (habitaciones.length === 0) {
        container.innerHTML = emptyState('door-open', 'No hay habitaciones registradas todavía.');
        return;
    }

    habitaciones.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    const rows = habitaciones.map(h => {
        const banoIcon = h.bano?.toLowerCase().includes('privado')
            ? '<i class="fas fa-toilet" style="color:#4caf50" title="Baño privado"></i>'
            : '<i class="fas fa-users" style="color:#ff9800" title="Baño compartido"></i>';

        const tipoIcon = h.tipo === 'Privada'
            ? '<i class="fas fa-user" style="color:var(--accent)"></i>'
            : '<i class="fas fa-users" style="color:var(--green)"></i>';

        return `
        <tr>
            <td><span class="chip-hab"><i class="fas fa-door-open" style="font-size:11px"></i> ${h.id}</span></td>
            <td>${tipoIcon} ${h.tipo}</td>
            <td style="text-align:center;"><strong>${h.capacidad}</strong> ${h.capacidad === 1 ? 'persona' : 'personas'}</td>
            <td style="font-size:12px; max-width:250px;">${h.descripcion || '—'}</td>
            <td style="text-align:center;">${banoIcon} ${h.bano || '—'}</td>
            <td style="text-align:center;">
                <button class="btn-eliminar-habitacion" data-id="${h.id}" title="Eliminar habitación">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <div class="table-wrapper">
            <table style="min-width: 650px;">
                <thead>
                    <tr>
                        <th>N°</th><th>Tipo</th><th>Capacidad</th>
                        <th>Descripción</th><th>Baño</th><th style="width:50px"></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;

    document.querySelectorAll('.btn-eliminar-habitacion').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            fnEliminarHabitacion(btn.getAttribute('data-id'));
        });
    });
}

// ─── Clientes ─────────────────────────────────────────────────
export function fnMostrarClientes() {
    const clientes  = JSON.parse(localStorage.getItem('clientes')) || [];
    const container = document.getElementById('listaClientes');

    if (clientes.length === 0) {
        container.innerHTML = emptyState('users', 'No hay clientes registrados todavía.');
        return;
    }

    const rows = clientes.map(c => `
        <tr>
            <td style="font-family:'DM Mono',monospace;font-size:13px;font-weight:500;">${c.dni}</td>
            <td>
                <div class="avatar-cell">
                    <div class="avatar">${iniciales(c.nombre, c.apellido)}</div>
                    <div>
                        <div class="cell-primary">${c.nombre} ${c.apellido}</div>
                        <div class="cell-secondary">${c.direccion || ''}</div>
                    </div>
                </div>
            </td>
            <td style="color:var(--text-2);font-size:13px;">${c.email}</td>
            <td style="font-family:'DM Mono',monospace;font-size:13px;color:var(--text-2);">${c.telefono}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr><th>DNI</th><th>Huésped</th><th>Email</th><th>Teléfono</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

// ─── Cambiar estado de reserva ────────────────────────────────
export function fnCambiarEstadoReserva(idReserva, nuevoEstado) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const reserva = reservas.find(r => r.id === idReserva);

    if (reserva) {
        reserva.estado = nuevoEstado;
        localStorage.setItem('reservas', JSON.stringify(reservas));
        fnMostrarReservas();
    }
}

// ─── Eliminar reserva ─────────────────────────────────────────
export function fnEliminarReserva(idReserva) {
    if (confirm('¿Estás seguro de que querés eliminar esta reserva?\n\nEsta acción no se puede deshacer.')) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const reservaEliminada = reservas.find(r => r.id === idReserva);

        if (reservaEliminada) {
            reservas = reservas.filter(r => r.id !== idReserva);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            alert(`✅ Reserva de habitación ${reservaEliminada.habitacion} eliminada correctamente.`);
            fnMostrarReservas();
        } else {
            alert('No se encontró la reserva.');
        }
    }
}

// ─── Reservas ─────────────────────────────────────────────────
export function fnMostrarReservas() {
    const reservas  = JSON.parse(localStorage.getItem('reservas'))  || [];
    const clientes  = JSON.parse(localStorage.getItem('clientes'))  || [];
    const container = document.getElementById('listaReservas');

    if (reservas.length === 0) {
        container.innerHTML = emptyState('calendar-alt', 'No hay reservas registradas todavía.');
        return;
    }

    const rows = reservas.map(r => {
        const cliente       = clientes.find(c => c.dni === r.dniCliente);
        const nombreCliente = cliente
            ? `<div class="cell-primary">${cliente.nombre} ${cliente.apellido}</div>
               <div class="cell-secondary">${r.dniCliente}</div>`
            : `<div class="cell-secondary">${r.dniCliente}</div>`;

        // Bug corregido: usar parseFechaLocal en lugar de new Date(string)
        // para evitar que el conteo de noches sea incorrecto en UTC-3.
        const noches = r.fechaIngreso && r.fechaEgreso
            ? Math.round((parseFechaLocal(r.fechaEgreso) - parseFechaLocal(r.fechaIngreso)) / 86400000)
            : '—';

        return `
        <tr>
            <td><span class="chip-hab"><i class="fas fa-door-open" style="font-size:11px"></i> ${r.habitacion}</span></td>
            <td>${nombreCliente}</td>
            <td class="fecha-cell">${formatDate(r.fechaIngreso)}</td>
            <td class="fecha-cell">${formatDate(r.fechaEgreso)}</td>
            <td style="font-size:13px;color:var(--text-2);">
                ${noches !== '—' ? noches + ' noche' + (noches !== 1 ? 's' : '') : '—'}
            </td>
            <td>
                <span style="display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--text-2);">
                    <i class="fas fa-user" style="font-size:10px;color:var(--text-3)"></i>
                    ${r.cantPersonas}
                </span>
            </td>
            <td>
                <select class="estado-select" data-id="${r.id}" style="padding:4px 6px;border-radius:4px;border:1px solid var(--border);background:var(--bg-2);color:var(--text);font-size:12px;cursor:pointer;">
                    <option value="pendiente" ${r.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="confirmada" ${r.estado === 'confirmada' ? 'selected' : ''}>Confirmada</option>
                    <option value="cancelada" ${r.estado === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
            </td>
            <td style="text-align:center;">
                <button class="btn-eliminar-reserva" data-id="${r.id}" title="Eliminar reserva">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <div class="table-wrapper">
            <table style="min-width: 750px;">
                <thead>
                    <tr>
                        <th>Hab.</th><th>Cliente</th><th>Ingreso</th><th>Egreso</th>
                        <th>Duración</th><th>Personas</th><th>Estado</th><th style="width:50px"></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;

    // Event listeners para cambiar estado
    document.querySelectorAll('.estado-select').forEach(select => {
        select.addEventListener('change', e => {
            const idReserva = select.getAttribute('data-id');
            const nuevoEstado = select.value;
            fnCambiarEstadoReserva(idReserva, nuevoEstado);
        });
    });

    // Event listeners para eliminar
    document.querySelectorAll('.btn-eliminar-reserva').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            fnEliminarReserva(btn.getAttribute('data-id'));
        });
    });
}
