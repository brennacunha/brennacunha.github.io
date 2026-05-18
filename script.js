window.addEventListener('DOMContentLoaded', () => {

document.querySelectorAll('a[href^="#"]').forEach(link => {

link.addEventListener('click', function(e){

e.preventDefault();

const alvo = document.querySelector(
this.getAttribute('href')
);

if(alvo){

const navbar = document.querySelector('.navbar');

const offset = navbar.offsetHeight;

const posicao = alvo.offsetTop - offset;

window.scrollTo({

top:posicao,

behavior:'smooth'

});

}

});

});

});