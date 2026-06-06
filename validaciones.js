// ─── validaciones.js - Funciones de validación robustas ───

// Validar que no esté vacío
export function isNotEmpty(value, fieldName) {
    if (!value || value.trim() === '') {
        alert(`⚠️ El campo "${fieldName}" es obligatorio.`);
        return false;
    }
    return true;
}

// Validar formato de email
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Ingresá un email válido (ej: nombre@dominio.com)');
        return false;
    }
    return true;
}

// Validar teléfono (solo números, con formato opcional)
export function isValidPhone(telefono) {
    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!phoneRegex.test(telefono)) {
        alert('⚠️ Ingresá un teléfono válido (mínimo 8 dígitos)');
        return false;
    }
    return true;
}

// Validar DNI (solo números, 7-8 dígitos)
export function isValidDNI(dni) {
    const dniRegex = /^\d{7,8}$/;
    if (!dniRegex.test(dni)) {
        alert('⚠️ El DNI debe tener 7 u 8 dígitos numéricos (sin puntos).');
        return false;
    }
    return true;
}

// Validar dirección (mínimo 5 caracteres, sugiere incluir número)
export function isValidDireccion(direccion) {
    if (direccion.length < 5) {
        alert('⚠️ La dirección es muy corta. Ingresá una dirección completa.');
        return false;
    }
    
    // Sugerir que incluya número de calle
    const tieneNumero = /\d/.test(direccion);
    if (!tieneNumero) {
        const confirmar = confirm('⚠️ La dirección no parece tener número de calle. ¿Querés continuar igual?');
        if (!confirmar) return false;
    }
    return true;
}

// Obtener nacionalidad final (si seleccionó "otra")
export function getNacionalidadFinal() {
    const select = document.getElementById('txtNacionalidadClnte');
    const otraInput = document.getElementById('txtOtraNacionalidad');
    
    if (select.value === 'otra') {
        const otra = otraInput.value.trim();
        if (!otra) {
            alert('⚠️ Especificá la nacionalidad en el campo adicional.');
            return null;
        }
        return otra;
    }
    
    if (!select.value) {
        alert('⚠️ Seleccioná una nacionalidad.');
        return null;
    }
    
    return select.value;
}

// Limpiar todos los campos del cliente
export function limpiarCamposCliente() {
    document.getElementById("txtNombreClnte").value = "";
    document.getElementById("txtApellidoClnte").value = "";
    document.getElementById("txtDNIClnte").value = "";
    document.getElementById("txtNacionalidadClnte").value = "";
    document.getElementById("txtOtraNacionalidad").value = "";
    document.getElementById("txtOtraNacionalidad").style.display = "none";
    document.getElementById("txtEmailClnte").value = "";
    document.getElementById("txtNroTelClnte").value = "";
    document.getElementById("txtDireccionClnte").value = "";
}

// Mostrar/ocultar campo "otra nacionalidad"
export function initNacionalidadListener() {
    const select = document.getElementById('txtNacionalidadClnte');
    const otraInput = document.getElementById('txtOtraNacionalidad');
    
    if (select) {
        select.addEventListener('change', () => {
            if (select.value === 'otra') {
                otraInput.style.display = 'block';
                otraInput.placeholder = 'Ej: Alemania, Japón, etc.';
                otraInput.required = true;
            } else {
                otraInput.style.display = 'none';
                otraInput.value = '';
                otraInput.required = false;
            }
        });
    }
}