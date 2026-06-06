// ─── Helpers ──────────────────────────────────────────────

function cleanReserva() {
    document.getElementById("txtHabitacionReserva").value = "";
    document.getElementById("txtDniClienteReserva").value = "";
    document.getElementById("txtFechaIngreso").value = "";
    document.getElementById("txtFechaEgreso").value = "";
    document.getElementById("txtCantidadPersonas").value = "";
    document.getElementById("txtEstadoReserva").value = "pendiente";
}

// ─── Cargar habitaciones en el select ─────────────────────
export function cargarHabitacionesEnSelect() {
    const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
    const select = document.getElementById("txtHabitacionReserva");
    if (select) {
        select.innerHTML = '<option value="">Seleccionar Habitación --</option>';
        habitaciones.forEach(h => {
            const option = document.createElement("option");
            option.value = h.id;
            option.textContent = `Habitación ${h.id} - ${h.tipo} (Cap: ${h.capacidad})`;
            select.appendChild(option);
        });
    }
}

// ─── Fijar fecha mínima al cargar ─────────────────────────
export function fnInicializarFechas() {
    const hoy = new Date().toISOString().split("T")[0];
    const inputIngreso = document.getElementById("txtFechaIngreso");
    const inputEgreso = document.getElementById("txtFechaEgreso");

    inputIngreso.min = hoy;
    inputEgreso.min = hoy;

    inputIngreso.onchange = () => {
        if (inputIngreso.value) {
            inputEgreso.min = inputIngreso.value;
            if (inputEgreso.value && inputEgreso.value <= inputIngreso.value) {
                inputEgreso.value = "";
            }
        }
    };
}

// ─── Verificar solapamiento de reservas ───────────────────
function hayConflicto(reservas, habitacion, fechaIngreso, fechaEgreso) {
    const ingreso = new Date(fechaIngreso);
    const egreso = new Date(fechaEgreso);
    
    return reservas.some(r => {
        if (r.habitacion !== habitacion) return false;
        if (r.estado === "cancelada") return false;
        
        const rIngreso = new Date(r.fechaIngreso);
        const rEgreso = new Date(r.fechaEgreso);
        
        return ingreso < rEgreso && egreso > rIngreso;
    });
}

// ─── Registrar Reserva ────────────────────────────────────
export function fnRegistrarReserva() {
    const habitacion = document.getElementById("txtHabitacionReserva").value;
    const dniCliente = document.getElementById("txtDniClienteReserva").value.trim();
    const fechaIngresoStr = document.getElementById("txtFechaIngreso").value;
    const fechaEgresoStr = document.getElementById("txtFechaEgreso").value;
    const cantPersonas = document.getElementById("txtCantidadPersonas").value;
    const estado = document.getElementById("txtEstadoReserva").value;

    // Validar campos
    if (!habitacion || !dniCliente || !fechaIngresoStr || !fechaEgresoStr || !cantPersonas || !estado) {
        alert("¡Complete todos los campos!");
        return;
    }

    // Validar fechas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaIngreso = new Date(fechaIngresoStr);
    const fechaEgreso = new Date(fechaEgresoStr);

    if (fechaIngreso < hoy) {
        alert("La fecha de ingreso no puede ser anterior a hoy.");
        return;
    }

    if (fechaEgreso <= fechaIngreso) {
        alert("La fecha de egreso debe ser posterior a la de ingreso.");
        return;
    }

    // Validar cliente
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    if (!clientes.some(c => c.dni === dniCliente)) {
        alert(`No existe cliente con DNI "${dniCliente}". Regístrelo primero.`);
        return;
    }

    // Validar capacidad
    const cant = parseInt(cantPersonas);
    if (isNaN(cant) || cant < 1) {
        alert("La cantidad de huéspedes debe ser mayor a 0.");
        return;
    }

    const habitaciones = JSON.parse(localStorage.getItem("habitaciones") || "[]");
    const habitacionData = habitaciones.find(h => h.id === habitacion);
    if (habitacionData && cant > parseInt(habitacionData.capacidad)) {
        alert(`La habitación tiene capacidad para ${habitacionData.capacidad} personas.`);
        return;
    }

    // Validar disponibilidad
    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
    if (hayConflicto(reservas, habitacion, fechaIngresoStr, fechaEgresoStr)) {
        alert("La habitación no está disponible en esas fechas.");
        return;
    }

    // Guardar reserva
    const nuevaReserva = {
        id: Date.now().toString(),
        habitacion,
        dniCliente,
        fechaIngreso: fechaIngresoStr,
        fechaEgreso: fechaEgresoStr,
        cantPersonas: cant,
        estado
    };

    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("¡Reserva registrada exitosamente!");
    cleanReserva();
}