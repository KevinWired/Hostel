// ─── Helpers de formato ────────────────────────────────────

function iniciales(nombre, apellido) {
    return ((nombre?.[0] || '') + (apellido?.[0] || '')).toUpperCase();
}

function formatDate(str) {
    // yyyy-mm-dd → dd/mm/aaaa
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return d && m && y ? `${d}/${m}/${y}` : str;
}

function emptyState(icon, msg) {
    return `<div class="empty-state">
        <i class="fas fa-${icon}"></i>
        <p>${msg}</p>
    </div>`;
}

// ─── Habitaciones (sin columna Piso) ───────────────────────

export function fnMostrarHabitaciones() {
    const habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || [];
    const container = document.getElementById('listaHabitaciones');

    if (habitaciones.length === 0) {
        container.innerHTML = emptyState('door-open', 'No hay habitaciones registradas todavía.');
        return;
    }

    const rows = habitaciones.map(h => `
        <tr>
            <td><span class="chip-hab"><i class="fas fa-door-open" style="font-size:11px"></i> ${h.id}</span></td>
            <td class="cell-primary">${h.tipo}</td>
            <td>
                <span style="display:inline-flex;align-items:center;gap:5px;font-size:13px;">
                    <i class="fas fa-user" style="font-size:10px;color:var(--text-3)"></i>
                    ${h.capacidad} pers.
                </span>
            </td>
        </tr>`
    ).join('');

    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Habitación</th>
                        <th>Tipo</th>
                        <th>Capacidad</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

// ─── Clientes (DNI como primera columna) ───────────────────

export function fnMostrarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
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
                    <tr>
                        <th>DNI</th>
                        <th>Huésped</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

// ─── Función para eliminar reserva ────────────────────────

export function fnEliminarReserva(idReserva) {
    if (confirm('¿Estás seguro de que querés eliminar esta reserva?')) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const reservaEliminada = reservas.find(r => r.id === idReserva);
        
        if (reservaEliminada) {
            reservas = reservas.filter(r => r.id !== idReserva);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            alert(`✅ Reserva de habitación ${reservaEliminada.habitacion} eliminada correctamente.`);
            fnMostrarReservas(); // Recargar la lista
        } else {
            alert('No se encontró la reserva.');
        }
    }
}

// ─── Reservas (con botón eliminar) ─────────────────────────

export function fnMostrarReservas() {
    const reservas  = JSON.parse(localStorage.getItem('reservas'))  || [];
    const clientes  = JSON.parse(localStorage.getItem('clientes'))  || [];
    const container = document.getElementById('listaReservas');

    if (reservas.length === 0) {
        container.innerHTML = emptyState('calendar-alt', 'No hay reservas registradas todavía.');
        return;
    }

    const rows = reservas.map(r => {
        const cliente = clientes.find(c => c.dni === r.dniCliente);
        const nombreCliente = cliente
            ? `<div class="cell-primary">${cliente.nombre} ${cliente.apellido}</div>
               <div class="cell-secondary">${r.dniCliente}</div>`
            : `<div class="cell-secondary">${r.dniCliente}</div>`;

        const badge = `badge-${r.estado}`;

        // Calcular noches
        const msDay = 86400000;
        const noches = r.fechaIngreso && r.fechaEgreso
            ? Math.round((new Date(r.fechaEgreso) - new Date(r.fechaIngreso)) / msDay)
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
            <td><span class="badge ${badge}">${r.estado}</span></td>
            <td style="text-align:center;">
                <button class="btn-eliminar" data-id="${r.id}" title="Eliminar reserva">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Hab.</th>
                        <th>Cliente</th>
                        <th>Ingreso</th>
                        <th>Egreso</th>
                        <th>Duración</th>
                        <th>Personas</th>
                        <th>Estado</th>
                        <th style="width:50px"></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            fnEliminarReserva(id);
        });
    });
}