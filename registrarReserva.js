// ─── Datos reales de las habitaciones del hostel ─────────────
const CAPACIDADES_POR_HABITACION = {
    1: 6, 2: 5, 3: 4, 4: 4, 5: 2,
    6: 4, 7: 5, 8: 6, 9: 6, 10: 2,
    11: 4, 12: 4, 13: 1, 14: 1, 15: 1
};

const TIPOS_POR_HABITACION = {
    1: "Compartida", 2: "Privada", 3: "Privada", 4: "Privada", 5: "Privada",
    6: "Privada", 7: "Privada", 8: "Privada", 9: "Privada", 10: "Privada",
    11: "Privada", 12: "Privada", 13: "Privada", 14: "Privada", 15: "Privada"
};

// ─── Parsear fecha local sin conversión UTC ───────────────────
// Usar new Date("YYYY-MM-DD") interpreta como UTC medianoche,
// lo que en UTC-3 desplaza al día anterior. Este helper evita ese bug.
function parseFechaLocal(str) {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // month es 0-indexed en JS
}

// ─── Formatear fecha a dd/mm/aaaa ─────────────────────────────
function formatDateToDisplay(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

// ─── Helpers ──────────────────────────────────────────────────
function cleanReserva() {
    document.getElementById("txtDniClienteReserva").value  = "";
    document.getElementById("txtHabitacionReserva").value  = "";
    document.getElementById("txtFechaIngreso").value       = "";
    document.getElementById("txtFechaEgreso").value        = "";
    document.getElementById("txtCantidadPersonas").value   = "";
    document.getElementById("txtEstadoReserva").value      = "pendiente";
}

// ─── Obtener capacidad máxima según número de habitación ──────
function getCapacidadMaximaPorHabitacion(habitacionId) {
    const num = parseInt(habitacionId);
    return CAPACIDADES_POR_HABITACION[num] || null;
}

// ─── Obtener tipo de habitación según número ──────────────────
function getTipoHabitacionPorNumero(habitacionId) {
    const num = parseInt(habitacionId);
    return TIPOS_POR_HABITACION[num] || null;
}

// ─── Verificar si una habitación es compartida ────────────────
function esHabitacionCompartida(habitacionId) {
    return getTipoHabitacionPorNumero(habitacionId) === "Compartida";
}

// ─── Calcular ocupación total en un rango de fechas ──────────
function calcularOcupacionHabitacion(reservas, habitacion, fechaIngreso, fechaEgreso, idReservaExcluir = null) {
    const ingreso = parseFechaLocal(fechaIngreso);
    const egreso  = parseFechaLocal(fechaEgreso);
    let totalOcupacion = 0;

    for (const r of reservas) {
        if (r.habitacion !== habitacion) continue;
        if (r.estado === "cancelada") continue;
        if (idReservaExcluir && r.id === idReservaExcluir) continue;

        const rIngreso = parseFechaLocal(r.fechaIngreso);
        const rEgreso  = parseFechaLocal(r.fechaEgreso);

        if (ingreso < rEgreso && egreso > rIngreso) {
            totalOcupacion += r.cantPersonas;
        }
    }

    return totalOcupacion;
}

// ─── Verificar disponibilidad según tipo de habitación ────────
function verificarDisponibilidad(reservas, habitacion, fechaIngreso, fechaEgreso, cantPersonas) {
    const capacidadMaxima = getCapacidadMaximaPorHabitacion(habitacion);
    const esCompartida    = esHabitacionCompartida(habitacion);

    if (esCompartida) {
        const ocupacionActual = calcularOcupacionHabitacion(reservas, habitacion, fechaIngreso, fechaEgreso);
        const nuevaOcupacion  = ocupacionActual + cantPersonas;

        if (nuevaOcupacion > capacidadMaxima) {
            return {
                disponible: false,
                mensaje: `⚠️ Habitación compartida ${habitacion}: capacidad total ${capacidadMaxima} personas.\n` +
                         `Ocupación actual en esas fechas: ${ocupacionActual} personas.\n` +
                         `Intento de agregar: ${cantPersonas} personas.\n` +
                         `Supera la capacidad (${nuevaOcupacion} > ${capacidadMaxima}).`
            };
        }
        return { disponible: true };
    } else {
        const tieneReservaActiva = reservas.some(r =>
            r.habitacion === habitacion &&
            r.estado !== "cancelada" &&
            !(parseFechaLocal(fechaEgreso)  <= parseFechaLocal(r.fechaIngreso) ||
              parseFechaLocal(fechaIngreso) >= parseFechaLocal(r.fechaEgreso))
        );

        if (tieneReservaActiva) {
            return {
                disponible: false,
                mensaje: `⚠️ La habitación ${habitacion} ya está reservada en esas fechas.\n` +
                         `Las habitaciones privadas solo admiten una reserva activa por vez.`
            };
        }
        return { disponible: true };
    }
}

// ─── Cargar habitaciones en el select ─────────────────────────
export function cargarHabitacionesEnSelect() {
    const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
    const select = document.getElementById("txtHabitacionReserva");
    if (select) {
        select.innerHTML = '<option value="">Seleccionar Habitación</option>';
        habitaciones.forEach(h => {
            const option = document.createElement("option");
            option.value = h.id;
            const tipoHabitacion = getTipoHabitacionPorNumero(h.id);
            const compartidaTag  = tipoHabitacion === "Compartida" ? "🔄 Compartida" : "🔒 Privada";
            const descPreview    = h.descripcion ? h.descripcion.substring(0, 30) : '';
            option.textContent   = `#${h.id} - ${h.tipo} (${h.capacidad} pers.) ${compartidaTag} ${descPreview ? '| ' + descPreview : ''}`;
            select.appendChild(option);
        });
    }
}

// ─── Fijar fecha mínima al cargar ─────────────────────────────
export function fnInicializarFechas() {
    const hoy         = new Date().toISOString().split("T")[0];
    const inputIngreso = document.getElementById("txtFechaIngreso");
    const inputEgreso  = document.getElementById("txtFechaEgreso");

    if (inputIngreso) {
        inputIngreso.min         = hoy;
        inputIngreso.placeholder = "AAAA-MM-DD";
    }
    if (inputEgreso) {
        inputEgreso.min         = hoy;
        inputEgreso.placeholder = "AAAA-MM-DD";
    }

    if (inputIngreso) {
        inputIngreso.onchange = () => {
            if (inputIngreso.value) {
                inputEgreso.min = inputIngreso.value;
                if (inputEgreso.value && inputEgreso.value <= inputIngreso.value) {
                    inputEgreso.value = "";
                    alert("⚠️ La fecha de egreso debe ser posterior a la fecha de ingreso.");
                }
            }
        };
    }
}

// ─── Calcular nro de noches ────────────────────────────────
function calcularNoches(fechaIngreso, fechaEgreso) {
    const ingreso = parseFechaLocal(fechaIngreso);
    const egreso  = parseFechaLocal(fechaEgreso);
    return Math.ceil(Math.abs(egreso - ingreso) / (1000 * 60 * 60 * 24));
}

// ─── Registrar Reserva ────────────────────────────────────────
export function fnRegistrarReserva() {
    const dniCliente      = document.getElementById("txtDniClienteReserva").value.trim();
    const habitacion      = document.getElementById("txtHabitacionReserva").value;
    const fechaIngresoStr = document.getElementById("txtFechaIngreso").value;
    const fechaEgresoStr  = document.getElementById("txtFechaEgreso").value;
    const cantPersonas    = document.getElementById("txtCantidadPersonas").value;
    const estado          = document.getElementById("txtEstadoReserva").value;

    // Validar campos obligatorios
    if (!dniCliente || !habitacion || !fechaIngresoStr || !fechaEgresoStr || !cantPersonas || !estado) {
        alert("⚠️ ¡Complete todos los campos!\n\n" +
              "• DNI del cliente\n• Habitación\n• Fecha de ingreso\n" +
              "• Fecha de egreso\n• Cantidad de personas\n• Estado de la reserva");
        return;
    }

    // ─── Validar fechas (UTC-3) ───────────
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaIngreso = parseFechaLocal(fechaIngresoStr);
    const fechaEgreso  = parseFechaLocal(fechaEgresoStr);

    if (fechaIngreso < hoy) {
        alert(`⚠️ La fecha de ingreso (${formatDateToDisplay(fechaIngresoStr)}) no puede ser anterior a hoy.`);
        return;
    }

    if (fechaEgreso <= fechaIngreso) {
        alert(`⚠️ La fecha de egreso (${formatDateToDisplay(fechaEgresoStr)}) debe ser posterior a la fecha de ingreso (${formatDateToDisplay(fechaIngresoStr)}).`);
        return;
    }

    // Validar existencia del cliente
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    const clienteExistente = clientes.find(c => c.dni === dniCliente);
    if (!clienteExistente) {
        alert(`⚠️ No existe cliente con DNI "${dniCliente}".\n\nRegístrelo primero en el módulo de clientes.`);
        return;
    }

    // Validar cantidad de personas
    const cant = parseInt(cantPersonas);
    if (isNaN(cant) || cant < 1) {
        alert("⚠️ La cantidad de huéspedes debe ser mayor a 0.");
        return;
    }

    // Validar capacidad
    const capacidadMaximaRegla = getCapacidadMaximaPorHabitacion(habitacion);
    if (!capacidadMaximaRegla) {
        alert(`⚠️ El número de habitación "${habitacion}" no es válido. Las habitaciones válidas son del 1 al 15.`);
        return;
    }

    if (cant > capacidadMaximaRegla) {
        const tipoSegunRegla = getTipoHabitacionPorNumero(habitacion);
        alert(`⚠️ La habitación ${habitacion} (${tipoSegunRegla}) tiene capacidad máxima de ${capacidadMaximaRegla} personas.\n\n` +
              `Solicitado: ${cant} | Máximo: ${capacidadMaximaRegla}`);
        return;
    }

    const habitaciones   = JSON.parse(localStorage.getItem("habitaciones") || "[]");
    const habitacionData = habitaciones.find(h => h.id === habitacion);
    if (habitacionData && cant > parseInt(habitacionData.capacidad)) {
        alert(`⚠️ La habitación ${habitacion} tiene capacidad registrada de ${habitacionData.capacidad} personas.\n\nNo puede reservar para ${cant} personas.`);
        return;
    }

    // Validar disponibilidad
    const reservas      = JSON.parse(localStorage.getItem("reservas") || "[]");
    const disponibilidad = verificarDisponibilidad(reservas, habitacion, fechaIngresoStr, fechaEgresoStr, cant);
    if (!disponibilidad.disponible) {
        alert(disponibilidad.mensaje);
        return;
    }

    const noches = calcularNoches(fechaIngresoStr, fechaEgresoStr);

    // Guardar reserva
    const nuevaReserva = {
        id: Date.now().toString(),
        habitacion,
        dniCliente,
        fechaIngreso: fechaIngresoStr,
        fechaEgreso:  fechaEgresoStr,
        cantPersonas: cant,
        estado
    };

    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Bug corregido: la ocupación del alert se calcula DESPUÉS de guardar
    // sin excluir nada, para mostrar el total real incluyendo la nueva reserva.
    const tipoHabitacion = getTipoHabitacionPorNumero(habitacion);
    const esCompartida   = tipoHabitacion === "Compartida";
    const ocupacionTotal = esCompartida
        ? calcularOcupacionHabitacion(reservas, habitacion, fechaIngresoStr, fechaEgresoStr)
        : cant;

    alert(`✅ ¡RESERVA REGISTRADA EXITOSAMENTE!\n\n` +
          `📋 Resumen de la reserva:\n` +
          `━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━\n` +
          `🏠 Habitación: ${habitacion} (${tipoHabitacion}) ${esCompartida ? '🔄' : '🔒'}\n` +
          `👤 Cliente: ${clienteExistente.nombre} ${clienteExistente.apellido}\n` +
          `📆 Ingreso: ${formatDateToDisplay(fechaIngresoStr)}\n` +
          `📆 Egreso: ${formatDateToDisplay(fechaEgresoStr)}\n` +
          `🌙 Noches: ${noches} ${noches === 1 ? 'noche' : 'noches'}\n` +
          `👥 Personas: ${cant}\n` +
          `📌 Estado: ${estado === 'pendiente' ? '⏳ Pendiente' : estado === 'confirmada' ? '✅ Confirmada' : '❌ Cancelada'}` +
          (esCompartida ? `\n\n📊 Ocupación total en esas fechas: ${ocupacionTotal}/${capacidadMaximaRegla} personas` : ""));

    cleanReserva();
}

// ─── Obtener información de la habitación ─────────────────────
export function getInfoHabitacion(habitacionId) {
    const capacidad = getCapacidadMaximaPorHabitacion(habitacionId);
    const tipo      = getTipoHabitacionPorNumero(habitacionId);
    return { capacidad, tipo, esCompartida: tipo === "Compartida" };
}
