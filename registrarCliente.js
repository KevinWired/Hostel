function cleanHuesped() {
    document.getElementById("txtNombreClnte").value    = "";
    document.getElementById("txtApellidoClnte").value  = "";
    document.getElementById("txtDNIClnte").value       = "";
    document.getElementById("txtEmailClnte").value     = "";
    document.getElementById("txtNroTelClnte").value    = "";
    document.getElementById("txtDireccionClnte").value = "";
}

function getFieldsClnte() {
    return {
        nombre:    document.getElementById("txtNombreClnte").value.trim(),
        apellido:  document.getElementById("txtApellidoClnte").value.trim(),
        dni:       document.getElementById("txtDNIClnte").value.trim(),
        email:     document.getElementById("txtEmailClnte").value.trim(),
        telefono:  document.getElementById("txtNroTelClnte").value.trim(),
        direccion: document.getElementById("txtDireccionClnte").value.trim(),
    };
}

export function fnRegistrarCliente(fnVolver) {

    const { nombre, apellido, dni, email, telefono, direccion } = getFieldsClnte();

    if (!nombre || !apellido || !dni || !email || !telefono || !direccion) {
        alert("¡Por favor completa todos los campos obligatorios!");
        return;
    }

    let clientes = JSON.parse(localStorage.getItem("clientes") || "[]");

    if (clientes.some(c => c.dni === dni)) {
        alert("El huesped ya está registrado!");
        cleanHuesped();
        return;
    }

    clientes.push({ nombre, apellido, dni, email, telefono, direccion });
    localStorage.setItem("clientes", JSON.stringify(clientes));

    alert("Huesped registrado!");
    cleanHuesped();
    fnVolver("secRegistrarCliente");
}