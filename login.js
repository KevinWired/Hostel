export function fnLogin(admins) {
    const txtUsuario = document.getElementById("txtUsuario");
    const txtClave = document.getElementById("txtClave");
    const loginFeedback = document.getElementById("loginFeedback");
    const vUsuario = txtUsuario.value.trim();
    const vClave = txtClave.value.trim();

    txtUsuario.classList.remove("input-error");
    txtClave.classList.remove("input-error");
    if (loginFeedback) {
        loginFeedback.textContent = "";
        loginFeedback.classList.remove("login-feedback--error");
    }

    if (vUsuario === "" || vClave === "") {
        if (vUsuario === "") txtUsuario.classList.add("input-error");
        if (vClave === "") txtClave.classList.add("input-error");
        if (loginFeedback) {
            loginFeedback.textContent = "Completá usuario y contraseña para continuar.";
            loginFeedback.classList.add("login-feedback--error");
        }
        alert("Campo usuario o clave vacío(s)!");
        return null;
    }

    const admin = admins.find(j => j.usuario === vUsuario && j.clave === vClave);

    if (!admin) {
        txtUsuario.classList.add("input-error");
        txtClave.classList.add("input-error");
        if (loginFeedback) {
            loginFeedback.textContent = "Usuario o contraseña incorrectos. Verificá tus datos.";
            loginFeedback.classList.add("login-feedback--error");
        }
        alert("Usuario o clave incorrectos");
        return null;
    }

    document.getElementById("secLogin").style.display = "none";
    document.getElementById("secMenu").style.display = "block";
    
    return admin;
}