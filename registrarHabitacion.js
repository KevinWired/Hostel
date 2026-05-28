function cleanHabitacion() {

    document.getElementById("txtIdHabitacion").value   = "";
    document.getElementById("txtTipoHabitacion").value = "";
    document.getElementById("txtPisoHabitacion").value = "";
    document.getElementById("txtCapacidad").value      = "";

}


export function fnRegistrarHabitacion(fnVolver) {

    const id          = document.getElementById("txtIdHabitacion").value.trim();
    const tipoHab     = document.getElementById("txtTipoHabitacion").value.trim();
    const pisoHab     = document.getElementById("txtPisoHabitacion").value.trim();
    const capacidadHab = document.getElementById("txtCapacidad").value.trim();

    if (!id || !tipoHab || !pisoHab || !capacidadHab) {
        alert("¡Por favor completa todos los campos obligatorios!");
        return;
    }

    let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

    if (habitaciones.some(h => h.id === id)) {
        alert("El ID de habitación ya está registrado.");
        cleanHabitacion()
        return;
    }

    habitaciones.push({ id, tipo: tipoHab, piso: pisoHab, capacidad: capacidadHab });
    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));

    alert("¡Habitación registrada exitosamente!");
    cleanHabitacion()

    fnVolver("secRegistrarHabitacion");
}
