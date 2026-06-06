import { 
    isNotEmpty, 
    isValidEmail, 
    isValidPhone, 
    isValidDNI, 
    isValidDireccion, 
    getNacionalidadFinal, 
    limpiarCamposCliente 
} from './validaciones.js';

function getFieldsClnte() {
    return {
        nombre:      document.getElementById("txtNombreClnte").value.trim(),
        apellido:    document.getElementById("txtApellidoClnte").value.trim(),
        dni:         document.getElementById("txtDNIClnte").value.trim(),
        nacionalidad: getNacionalidadFinal(),
        email:       document.getElementById("txtEmailClnte").value.trim(),
        telefono:    document.getElementById("txtNroTelClnte").value.trim(),
        direccion:   document.getElementById("txtDireccionClnte").value.trim(),
    };
}

export function fnRegistrarCliente(fnVolver) {
    const { nombre, apellido, dni, nacionalidad, email, telefono, direccion } = getFieldsClnte();

    // Validaciones paso a paso
    if (!isNotEmpty(nombre, 'Nombre')) return;
    if (!isNotEmpty(apellido, 'Apellido')) return;
    if (!isNotEmpty(dni, 'DNI')) return;
    if (!isValidDNI(dni)) return;
    if (!nacionalidad) return; // ya muestra alerta dentro de getNacionalidadFinal
    if (!isNotEmpty(email, 'Email')) return;
    if (!isValidEmail(email)) return;
    if (!isNotEmpty(telefono, 'Teléfono')) return;
    if (!isValidPhone(telefono)) return;
    if (!isNotEmpty(direccion, 'Dirección')) return;
    if (!isValidDireccion(direccion)) return;

    // Verificar duplicado por DNI
    let clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    if (clientes.some(c => c.dni === dni)) {
        alert(`⚠️ Ya existe un cliente con DNI ${dni}.`);
        return;
    }

    // Verificar duplicado por email (opcional, pero útil)
    if (clientes.some(c => c.email === email)) {
        const confirmar = confirm(`⚠️ El email ${email} ya está registrado con otro cliente. ¿Querés continuar igual?`);
        if (!confirmar) return;
    }

    // Guardar cliente
    const nuevoCliente = { 
        nombre, 
        apellido, 
        dni, 
        nacionalidad, 
        email, 
        telefono, 
        direccion 
    };
    
    clientes.push(nuevoCliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    alert(`✅ Huésped ${nombre} ${apellido} registrado correctamente.`);
    limpiarCamposCliente();
    fnVolver("secRegistrarCliente");
}