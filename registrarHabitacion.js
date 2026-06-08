// ─── Datos reales de las habitaciones del hostel ─────────────
const HABITACIONES_DATA = {
    1: { capacidad: 6, tipo: "Compartida", descripcion: "COMPARTIDA, camas individuales cucheta", bano: "COMPARTIDO" },
    2: { capacidad: 5, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 1 cama individual, 1 cama doble", bano: "COMPARTIDO (hab 2 y 3)" },
    3: { capacidad: 4, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 1 cama doble", bano: "COMPARTIDO (hab 2 y 3)" },
    4: { capacidad: 4, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 1 cama doble", bano: "COMPARTIDO (hab 4 y 5)" },
    5: { capacidad: 2, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta", bano: "COMPARTIDO (hab 4 y 5)" },
    6: { capacidad: 4, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 1 cama doble", bano: "PRIVADO" },
    7: { capacidad: 5, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 1 cama individual, 1 cama doble", bano: "COMPARTIDO (hab 7, 8 y 10)" },
    8: { capacidad: 6, tipo: "Privada", descripcion: "PRIVADA, 2 cuchetas, 1 cama doble", bano: "COMPARTIDO (hab 7, 8 y 10)" },
    9: { capacidad: 6, tipo: "Privada", descripcion: "PRIVADA, 2 cuchetas, 1 cama doble", bano: "PRIVADO" },
    10: { capacidad: 2, tipo: "Privada", descripcion: "PRIVADA, 1 cama doble", bano: "COMPARTIDO (hab 7, 8 y 10)" },
    11: { capacidad: 4, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 1 cama doble", bano: "COMPARTIDO (hab 11,12,13,14,15)" },
    12: { capacidad: 4, tipo: "Privada", descripcion: "PRIVADA, 1 cucheta, 2 camas individuales", bano: "COMPARTIDO (hab 11,12,13,14,15)" },
    13: { capacidad: 1, tipo: "Privada", descripcion: "PRIVADA, 1 cama individual", bano: "COMPARTIDO (hab 11,12,13,14,15)" },
    14: { capacidad: 1, tipo: "Privada", descripcion: "PRIVADA, 1 cama individual", bano: "COMPARTIDO (hab 11,12,13,14,15)" },
    15: { capacidad: 1, tipo: "Privada", descripcion: "PRIVADA, 1 cama individual", bano: "COMPARTIDO (hab 11,12,13,14,15)" }
};

// ─── Obtener información completa de la habitación ────────────
export function obtenerInfoHabitacion(numero) {
    const num = parseInt(numero);
    if (isNaN(num)) return null;
    return HABITACIONES_DATA[num] || null;
}

// ─── Actualizar campos automáticamente al cambiar el ID ───────
function actualizarCamposAutomaticos() {
    const idInput        = document.getElementById("txtIdHabitacion");
    const tipoInput      = document.getElementById("txtTipoHabitacion");
    const capacidadInput = document.getElementById("txtCapacidad");
    const descripcionInput = document.getElementById("txtDescripcionHabitacion");
    const banoInput      = document.getElementById("txtBanoHabitacion");

    const numero = idInput.value.trim();
    const info   = obtenerInfoHabitacion(numero);

    if (info && numero !== "") {
        tipoInput.value       = info.tipo;
        capacidadInput.value  = info.capacidad;
        descripcionInput.value = info.descripcion;
        banoInput.value       = info.bano;

        const campos = [tipoInput, capacidadInput, descripcionInput, banoInput];
        campos.forEach(c => { if (c) c.style.backgroundColor = "#E8F5E9"; });
        setTimeout(() => {
            campos.forEach(c => { if (c) c.style.backgroundColor = ""; });
        }, 500);
    } else {
        tipoInput.value       = "";
        capacidadInput.value  = "";
        descripcionInput.value = "";
        banoInput.value       = "";
    }
}

// ─── Limpiar formulario ───────────────────────────────────────
function cleanHabitacion() {
    document.getElementById("txtIdHabitacion").value        = "";
    document.getElementById("txtTipoHabitacion").value      = "";
    document.getElementById("txtCapacidad").value           = "";
    document.getElementById("txtDescripcionHabitacion").value = "";
    document.getElementById("txtBanoHabitacion").value      = "";
}

// ─── Inicializar listener para auto-completado ────────────────
export function initHabitacionAutoComplete() {
    const idInput = document.getElementById("txtIdHabitacion");
    if (idInput) {
        idInput.addEventListener('input', actualizarCamposAutomaticos);
        idInput.addEventListener('blur',  actualizarCamposAutomaticos);
    }
}

// ─── Obtener todas las habitaciones registradas ───────────────
export function obtenerHabitaciones() {
    return JSON.parse(localStorage.getItem("habitaciones")) || [];
}

// ─── Registrar Habitación ─────────────────────────────────────
// Bug corregido: fnRecargarSelect se recibe como parámetro desde app.js
// en lugar de intentar llamar a window.cargarHabitacionesEnSelect,
// que nunca estaba disponible en este scope.
export function fnRegistrarHabitacion(fnVolver, fnRecargarSelect) {
    const id          = document.getElementById("txtIdHabitacion").value.trim();
    const tipo        = document.getElementById("txtTipoHabitacion").value.trim();
    const capacidad   = document.getElementById("txtCapacidad").value.trim();
    const descripcion = document.getElementById("txtDescripcionHabitacion").value.trim();
    const bano        = document.getElementById("txtBanoHabitacion").value.trim();

    if (!id) {
        alert("⚠️ El número de habitación es obligatorio.");
        return;
    }

    const numId = parseInt(id);
    if (isNaN(numId)) {
        alert("⚠️ El número de habitación debe ser un valor numérico.");
        return;
    }

    if (numId < 1 || numId > 15) {
        alert("⚠️ El hostel cuenta con habitaciones del 1 al 15.\n\nPor favor ingresá un número válido.");
        return;
    }

    const info = obtenerInfoHabitacion(id);
    if (!info) {
        alert("⚠️ Número de habitación no válido.");
        return;
    }

    if (tipo !== info.tipo) {
        alert(`⚠️ La habitación ${id} debe ser de tipo "${info.tipo}".`);
        return;
    }

    if (parseInt(capacidad) !== info.capacidad) {
        alert(`⚠️ La habitación ${id} debe tener capacidad para ${info.capacidad} personas.`);
        return;
    }

    let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
    if (habitaciones.some(h => h.id === id)) {
        alert(`⚠️ Ya existe una habitación registrada con el número ${id}.`);
        cleanHabitacion();
        return;
    }

    habitaciones.push({
        id,
        tipo,
        capacidad: parseInt(capacidad),
        descripcion,
        bano
    });

    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));

    alert(`✅ Habitación ${id} (${tipo}) registrada exitosamente.\n` +
          `   Capacidad: ${info.capacidad} personas\n` +
          `   Baño: ${bano}`);

    cleanHabitacion();

    // Recargar el select de reservas usando la función recibida como parámetro
    if (typeof fnRecargarSelect === 'function') fnRecargarSelect();

    fnVolver("secRegistrarHabitacion");
}
