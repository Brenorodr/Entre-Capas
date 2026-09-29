const forms = document.getElementById("formulario");

/* ---------- MÁSCARAS ---------- */
const mascaras = {
    telefone: v => v.replace(/\D/g, "").slice(0, 11)
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2"),

    cpf: v => v.replace(/\D/g, "").slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),

    nascimento: v => v.replace(/\D/g, "").slice(0, 8)
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2"),

    cep: v => v.replace(/\D/g, "").slice(0, 8)
        .replace(/(\d{5})(\d)/, "$1-$2")
};

/* ---------- FUNÇÕES AUXILIARES ---------- */
function cpfValido(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) {
            soma += Number(cpf[i]) * (t + 1 - i);
        }
        let digito = (soma * 10) % 11;
        if (digito === 10) digito = 0;
        if (digito !== Number(cpf[t])) return false;
    }
    return true;
}

function dataValida(texto) {
    const m = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return false;

    const dia = Number(m[1]);
    const mes = Number(m[2]);
    const ano = Number(m[3]);
    const data = new Date(ano, mes - 1, dia);

    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
        return false;
    }
    return ano >= 1900 && data <= new Date();
}

/* ---------- REGRAS: cada uma devolve a lista de erros do campo ---------- */
const regras = {
    nome() {
        const nome = document.getElementById("nome").value.trim();
        const erros = [];
        if (nome.length < 2) {
            erros.push("informe o nome (mínimo 2 letras)");
        } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
            erros.push("use apenas letras e espaços");
        }
        return erros;
    },

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

    telefone() {
        const erros = [];
        if (document.getElementById("telefone").value.length !== 15) {
            erros.push("informe DDD + 9 dígitos, ex.: (24) 99999-9999");
        }
        return erros;
    },

    cpf() {
        const valor = document.getElementById("cpf").value;
        const erros = [];
        if (valor.length !== 14) {
            erros.push("CPF incompleto");
        } else if (!cpfValido(valor)) {
            erros.push("CPF inválido");
        }
        return erros;
    },

    nascimento() {
        const erros = [];
        if (!dataValida(document.getElementById("nascimento").value)) {
            erros.push("data inválida (use dd/mm/aaaa)");
        }
        return erros;
    },

    cep() {
        const erros = [];
        if (document.getElementById("cep").value.length !== 9) {
            erros.push("CEP incompleto (00000-000)");
        }
        return erros;
    },

    senha() {
        const senha = document.getElementById("senha").value;
        const erros = [];
        if (senha.length < 8 || senha.length > 15) erros.push("de 8 a 15 caracteres");
        if (!/[0-9]/.test(senha)) erros.push("falta um número");
        if (!/[a-z]/.test(senha)) erros.push("falta uma letra minúscula");
        if (!/[A-Z]/.test(senha)) erros.push("falta uma letra maiúscula");
        if (!/[\W_]/.test(senha)) erros.push("falta um símbolo");
        return erros;
    },

    confirmar_senha() {
        const senha = document.getElementById("senha").value;
        const confirmacao = document.getElementById("confirmar_senha").value;
        const erros = [];
        if (confirmacao === "") {
            erros.push("confirme a senha");
        } else if (confirmacao !== senha) {
            erros.push("as senhas não coincidem");
        }
        return erros;
    }
};

/* ---------- MOSTRA O RESULTADO NA TELA ---------- */
function validar(id) {
    const erros = regras[id]();
    const saida = document.getElementById("saida_" + id);

    if (erros.length === 0) {
        saida.textContent = "Válido";
        saida.style.color = "lightgreen";
    } else {
        saida.textContent = "Erro... " + erros.join("; ");
        saida.style.color = "pink";
    }
    return erros;
}

/* ---------- VALIDAÇÃO AO DIGITAR (só o campo que mudou) ---------- */
forms.addEventListener("input", (evento) => {
    const id = evento.target.id;
    if (!regras[id]) return;

    if (mascaras[id]) {
        evento.target.value = mascaras[id](evento.target.value);
    }

    validar(id);

    // se mexeu na senha e a confirmação já foi preenchida, revalida a confirmação
    if (id === "senha" && document.getElementById("confirmar_senha").value !== "") {
        validar("confirmar_senha");
    }
});

/* ---------- ENVIO ---------- */
forms.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let primeiroInvalido = null;
    Object.keys(regras).forEach((id) => {
        const erros = validar(id);
        if (erros.length > 0 && primeiroInvalido === null) {
            primeiroInvalido = id;
        }
    });

    if (primeiroInvalido !== null) {
        document.getElementById(primeiroInvalido).focus();
        return;
    }

    const usuario = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        telefone: document.getElementById("telefone").value,
        cpf: document.getElementById("cpf").value,
        nascimento: document.getElementById("nascimento").value,
        cep: document.getElementById("cep").value,
        senha: document.getElementById("senha").value,
        coins: 0
    };

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    if (usuarios.some((u) => u.email === usuario.email)) {
        const saida = document.getElementById("saida_email");
        saida.textContent = "Erro... este e-mail já está cadastrado";
        saida.style.color = "pink";
        document.getElementById("email").focus();
        return;
    }

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "Entre_capas-login.html";
});

/* ---------- OLHO DA SENHA ---------- */
const campoSenha = document.getElementById("senha");
const olho = document.getElementById("iconeOlho");

olho.addEventListener("click", () => {
    const mostrar = campoSenha.type === "password";
    campoSenha.type = mostrar ? "text" : "password";
    olho.textContent = mostrar ? "visibility" : "visibility_off";
});