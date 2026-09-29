const forms = document.getElementById("formulario");

/* ---------- REGRAS: cada uma devolve a lista de erros do campo ---------- */
const regras = {
    email() {
        const email = document.getElementById("email").value.trim();
        const erros = [];
        if (email === "") {
            erros.push("informe o e-mail");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            erros.push("formato inválido (ex.: nome@email.com)");
        }
        return erros;
    },

    senha() {
        const erros = [];
        if (document.getElementById("senha").value === "") {
            erros.push("informe a senha");
        }
        return erros;
    }
};

/* ---------- MOSTRA O RESULTADO NA TELA ---------- */
function validar(id) {
    const erros = regras[id]();
    const saida = document.getElementById("saida_" + id);

    if (erros.length === 0) {
        saida.textContent = "";
    } else {
        saida.textContent = "Erro... " + erros.join("; ");
        saida.style.color = "pink";
    }
    return erros;
}

/* ---------- VALIDAÇÃO AO DIGITAR ---------- */
forms.addEventListener("input", (evento) => {
    const id = evento.target.id;
    if (regras[id]) validar(id);
    document.getElementById("saida_login").textContent = "";
});

/* ---------- ENVIO ---------- */
forms.addEventListener("submit", (evento) => {
    evento.preventDefault(); // impede a página de recarregar (e a senha de ir para a URL)

    const errosEmail = validar("email");
    const errosSenha = validar("senha");

    if (errosEmail.length > 0) {
        document.getElementById("email").focus();
        return;
    }
    if (errosSenha.length > 0) {
        document.getElementById("senha").focus();
        return;
    }

    // procura o usuário salvo pela página de cadastro
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

    const saidaLogin = document.getElementById("saida_login");

    if (!usuario) {
        saidaLogin.textContent = "E-mail ou senha incorretos.";
        saidaLogin.style.color = "pink";
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    alert("Bem-vindo(a), " + usuario.nome + "!");
    window.location.href = "../Home_Page/Entre_capas.html";
});

/* ---------- OLHO DA SENHA ---------- */
const campoSenha = document.getElementById("senha");
const olho = document.getElementById("iconeOlho");

olho.addEventListener("click", () => {
    const mostrar = campoSenha.type === "password";
    campoSenha.type = mostrar ? "text" : "password";
    olho.textContent = mostrar ? "visibility" : "visibility_off";
});
