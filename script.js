document.addEventListener("DOMContentLoaded", () => {

// RESPONSIVIDADE
// CONTROLE MENU
// REVEAL
// ANIMAÇÕES
// MICROINTERAÇÕES

const sections = document.querySelectorAll(
"body[id], section[id]"
);

const menuItems = document.querySelectorAll(".menu li");
const revealItems = document.querySelectorAll(
".hero-text, .hero-image, .about-left, .skill, .experience-header, .exp-item, .exp-highlight, .projects-header, .project-card"
);


// MENU ATIVO

function updateMenu(){

let current = "topo";

sections.forEach(section => {

const top = section.offsetTop - 180;
const height = section.offsetHeight;

if(
window.scrollY >= top &&
window.scrollY < top + height
){
current = section.id;
}

});

menuItems.forEach(item => {

const link = item.querySelector("a");

if(
link &&
link.getAttribute("href") === `#${current}`
){
item.classList.add("active");
}
else{
item.classList.remove("active");
}

});

}


// SCROLL COM THROTTLE

let ticking = false;

window.addEventListener("scroll", () => {

if(!ticking){

window.requestAnimationFrame(() => {

updateMenu();

ticking = false;

});

ticking = true;

}

});


// ESTADO INICIAL

updateMenu();

// REVEAL

revealItems.forEach(item => item.classList.add("home-reveal"));

if(!("IntersectionObserver" in window)){

revealItems.forEach(item => item.classList.add("is-visible"));

return;

}

const revealObserver = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("is-visible");
revealObserver.unobserve(entry.target);

}

});

}, {
threshold:0.14
});

revealItems.forEach(item => revealObserver.observe(item));

});
