export function fnLogin(admins) {

    const vUsuario = document.getElementById("txtUsuario").value;
    const vClave   = document.getElementById("txtClave").value;

    if (vUsuario === "" || vClave === "") {
        alert("Campo usuario o clave vacío(s)!");
        return;
    }

    const admin = admins.find(
        j => j.usuario === vUsuario && j.clave === vClave
    );

    if (!admin) {
        alert("Usuario o clave incorrectos");
        return;
    }

    document.getElementById("secLogin").style.display = "none";
    document.getElementById("secMenu").style.display  = "block";
}
