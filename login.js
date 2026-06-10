export function fnLogin(admins) {
    const vUsuario = document.getElementById("txtUsuario").value.trim();
    const vClave = document.getElementById("txtClave").value.trim();

    if (vUsuario === "" || vClave === "") {
        alert("Campo usuario o clave vacío(s)!");
        return null;
    }

    const admin = admins.find(j => j.usuario === vUsuario && j.clave === vClave);

    if (!admin) {
        alert("Usuario o clave incorrectos");
        return null;
    }

    document.getElementById("secLogin").style.display = "none";
    document.getElementById("secMenu").style.display = "block";
    
    return admin;
}