

/*-----------------------------------------------------SETA SCROLL-------------------------------------------------------------*/
function button_acess(){
    let bloco=document.getElementById("acess_block");
    bloco.classList.toggle("mostrar");
}

document.getElementById("acess_button").addEventListener("click",button_acess);

function scroll_setas(id,sentido){
    const list=document.getElementById(id);
    const distancia=300;
    list.scrollLeft+=(sentido*distancia);
    

}


document.getElementById("seta1").addEventListener("click",()=>scroll_setas("items_generos", -1));
document.getElementById("seta2").addEventListener("click",()=>scroll_setas("items_generos", 1));

document.getElementById("seta3").addEventListener("click",()=>scroll_setas("items_livros", -1));
document.getElementById("seta4").addEventListener("click",()=>scroll_setas("items_livros", 1));

/*----------------------------------------------------TAMANHO DO TEXTO------------------------------------------------------------*/

let escala=100
const escala_padrao=100;
const incremento=20;
const tamanho_min=100;
const tamanho_max=200;
const elemento=document.documentElement;

function tamanho(nova_escala){
    escala=Math.min(Math.max(nova_escala,tamanho_min),tamanho_max);
    elemento.style.fontSize=`${escala}%`
} 

document.getElementById("aumentar").addEventListener("click",()=>{tamanho(escala+incremento);});

document.getElementById("diminuir").addEventListener("click",()=>{tamanho(escala-incremento);});

document.getElementById("resetar").addEventListener("click",()=>{tamanho(escala_padrao);});

/*----------------------------------------------------------TEMA--------------------------------------------------------*/

const botao_tema=document.getElementById("button_tema")

function aplicar_tema(tema){
    if (tema==="escuro"){
        elemento.setAttribute("data-tema","escuro");
        botao_tema.textContent="Alternar para claro";
    } else{
        elemento.setAttribute("data-tema","claro")
        botao_tema.textContent="Alternar para escuro";
    }

}

botao_tema.addEventListener("click",()=>{
    const tema_salvo=elemento.getAttribute("data-tema")
    if (tema_salvo==="escuro"){
        aplicar_tema("claro")
    }else{
        aplicar_tema("escuro")
    }

});

/*--------------------------------------------------------------------------------*/

const livros = document.querySelectorAll('.button_display');

const observador = new IntersectionObserver((entradas) => {

    entradas.forEach((entrada, index) => {

        if (entrada.isIntersecting) {

            setTimeout(() => {
                entrada.target.classList.add('aparecer');
            }, index * 150);

            observador.unobserve(entrada.target);
        }

    });

}, {
    threshold: 0.2
});

livros.forEach(livro => {
    observador.observe(livro);
});

// ROLAGEM DOS LIVROS

