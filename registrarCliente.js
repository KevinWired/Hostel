import { 
    isNotEmpty, 
    isValidEmail, 
    isValidPhone, 
    isValidDNI, 
    isValidDireccion, 
    getNacionalidadFinal, 
    limpiarCamposCliente 
} from './validaciones.js';

const STORAGE_KEY = "clientes";

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

function cargarClientes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
        console.error("Error al cargar clientes:", e);
        alert("⚠️ Error al acceder a los datos.");
        throw e;
    }
}

function guardarClientes(clientes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    } catch (e) {
        console.error("Error al guardar clientes:", e);
        alert("⚠️ Error al guardar. Espacio insuficiente.");
        throw e;
    }
}

export function fnRegistrarCliente(fnVolver) {
    try {
        const { nombre, apellido, dni, nacionalidad, email, telefono, direccion } = getFieldsClnte();

        // Validaciones
        if (!isNotEmpty(nombre, 'Nombre')) return false;
        if (!isNotEmpty(apellido, 'Apellido')) return false;
        if (!isNotEmpty(dni, 'DNI')) return false;
        if (!isValidDNI(dni)) return false;
        if (!nacionalidad) return false;
        if (!isNotEmpty(email, 'Email')) return false;
        if (!isValidEmail(email)) return false;
        if (!isNotEmpty(telefono, 'Teléfono')) return false;
        if (!isValidPhone(telefono)) return false;
        if (!isNotEmpty(direccion, 'Dirección')) return false;
        if (!isValidDireccion(direccion)) return false;

        // Cargar clientes con manejo de error
        let clientes = cargarClientes();

        // Verificar duplicados
        if (clientes.some(c => c.dni === dni)) {
            alert(`⚠️ Ya existe un cliente con DNI ${dni}.`);
            return false;
        }

        if (clientes.some(c => c.email === email)) {
            alert(`⚠️ El email ${email} ya está registrado.`);
            return false;
        }

        // Guardar con ID único
        const nuevoCliente = { 
            id: Date.now(), // O usar crypto.randomUUID()
            nombre, apellido, dni, nacionalidad, email, telefono, direccion,
            createdAt: new Date().toISOString() // ⭐ Timestamp
        };
        
        clientes.push(nuevoCliente);
        guardarClientes(clientes);

        alert(`✅ Huésped ${nombre} ${apellido} registrado correctamente.`);
        limpiarCamposCliente();
        
        // Validar que fnVolver existe
        if (typeof fnVolver === 'function') {
            fnVolver("secRegistrarCliente");
        }
        
        return true;

    } catch (error) {
        console.error("Error en fnRegistrarCliente:", error);
        alert("❌ Error inesperado. Por favor, intenta de nuevo.");
        return false;
    }
}