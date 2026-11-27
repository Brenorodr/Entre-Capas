const formulario = document.getElementById('formulario');
const saidaLogin = document.getElementById('saida_login');
const el = (id) => document.getElementById(id);

/* ---------- REGRAS ---------- */

const regras = {
    email: (v) => {
        if (v.trim() === '') return 'Informe o e-mail.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido.';
    },
    senha: (v) => v !== '' || 'Informe a senha.'
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
        saidaLogin.textContent = '';
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
    saidaLogin.classList.remove('ok');

    const emailOk = validar('email');
    const senhaOk = validar('senha');

    if (!emailOk) { el('email').focus(); return; }
    if (!senhaOk) { el('senha').focus(); return; }

    // procura o usuário salvo pela página de cadastro
    const email = el('email').value.trim().toLowerCase();
    const senha = el('senha').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

    if (!usuario) {
        saidaLogin.textContent = 'E-mail ou senha incorretos.';
        return;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    saidaLogin.classList.add('ok');
    saidaLogin.textContent = 'Bem-vindo(a), ' + usuario.nome.split(' ')[0] + '!';

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
});
