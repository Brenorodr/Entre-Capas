const formulario = document.getElementById('formulario');
const saidaCadastro = document.getElementById('saida_cadastro');

const el = (id) => document.getElementById(id);
const soNumeros = (v) => v.replace(/\D/g, '');


/* ---------- MÁSCARAS ---------- */

function mascaraTelefone(v) {
    v = soNumeros(v).slice(0, 11);
    if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    if (v.length > 6) return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    if (v.length > 2) return v.replace(/^(\d{2})(\d*)/, '($1) $2');
    return v ? '(' + v : '';
}

function mascaraCPF(v) {
    v = soNumeros(v).slice(0, 11);
    return v
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function mascaraData(v) {
    v = soNumeros(v).slice(0, 8);
    return v
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
}

function mascaraCEP(v) {
    v = soNumeros(v).slice(0, 8);
    return v.replace(/^(\d{5})(\d)/, '$1-$2');
}

const mascaras = {
    telefone: mascaraTelefone,
    cpf: mascaraCPF,
    nascimento: mascaraData,
    cep: mascaraCEP
};

Object.keys(mascaras).forEach((id) => {
    el(id).addEventListener('input', (e) => {
        e.target.value = mascaras[id](e.target.value);
    });
});


/* ---------- VALIDAÇÕES ---------- */

function cpfValido(cpf) {
    cpf = soNumeros(cpf);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) soma += cpf[i] * (t + 1 - i);
        const digito = ((soma * 10) % 11) % 10;
        if (digito != cpf[t]) return false;
    }
    return true;
}

function dataValida(v) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
    if (!m) return false;

    const dia = +m[1], mes = +m[2], ano = +m[3];
    const data = new Date(ano, mes - 1, dia);

    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return false;
    return data <= new Date() && ano >= 1900;
}

const regras = {
    nome: (v) => (/^[A-Za-zÀ-ÿ\s]+$/.test(v.trim()) && v.trim().split(/\s+/).length >= 2) || 'Informe nome e sobrenome, só com letras.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Informe um e-mail válido.',
    telefone: (v) => [10, 11].includes(soNumeros(v).length) || 'Informe um telefone com DDD.',
    cpf: (v) => cpfValido(v) || 'CPF inválido.',
    nascimento: (v) => dataValida(v) || 'Use o formato dd/mm/aaaa.',
    cep: (v) => soNumeros(v).length === 8 || 'O CEP deve ter 8 dígitos.',
    senha: (v) => (v.length >= 8 && v.length <= 15 && /[0-9]/.test(v) && /[a-z]/.test(v) && /[A-Z]/.test(v) && /[\W_]/.test(v)) || 'Use de 8 a 15 caracteres, com maiúscula, minúscula, número e símbolo.',
    confirmar: (v) => v === el('senha').value || 'As senhas não coincidem.'
};

function validar(id) {
    const campo = el(id).closest('.campo');
    const resultado = regras[id](el(id).value);
    const ok = resultado === true;

    campo.classList.toggle('invalido', !ok);
    campo.querySelector('.erro').textContent = ok ? '' : resultado;
    el(id).setAttribute('aria-invalid', ok ? 'false' : 'true');

    return ok;
}

Object.keys(regras).forEach((id) => {
    el(id).addEventListener('blur', () => validar(id));
    el(id).addEventListener('input', () => {
        if (el(id).closest('.campo').classList.contains('invalido')) validar(id);
    });
});


/* ---------- MOSTRAR / OCULTAR SENHA ---------- */

document.querySelectorAll('.ver_senha').forEach((botao) => {
    botao.addEventListener('click', () => {
        const input = el(botao.dataset.alvo);
        const icone = botao.querySelector('.material-icons');
        const mostrar = input.type === 'password';

        input.type = mostrar ? 'text' : 'password';
        icone.textContent = mostrar ? 'visibility' : 'visibility_off';
        botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
    });
});


/* ---------- ENVIO ---------- */

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    let primeiroErro = null;
    Object.keys(regras).forEach((id) => {
        if (!validar(id) && !primeiroErro) primeiroErro = el(id);
    });

    if (primeiroErro) {
        primeiroErro.focus();
        return;
    }

    const usuario = {
        nome: el('nome').value.trim(),
        email: el('email').value.trim().toLowerCase(),
        telefone: el('telefone').value,
        cpf: el('cpf').value,
        nascimento: el('nascimento').value,
        cep: el('cep').value,
        senha: el('senha').value,
        coins: 0
    };

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    if (usuarios.some((u) => u.email === usuario.email)) {
        const campo = el('email').closest('.campo');
        campo.classList.add('invalido');
        campo.querySelector('.erro').textContent = 'Este e-mail já está cadastrado.';
        el('email').focus();
        return;
    }

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    saidaCadastro.textContent = 'Conta criada com sucesso! Redirecionando para o login...';
    setTimeout(() => {
        window.location.href = 'Entre_capas-login.html';
    }, 1500);
});
