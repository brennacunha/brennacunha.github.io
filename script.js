document.addEventListener("DOMContentLoaded", () => {

const sections = document.querySelectorAll(
"body[id], section[id]"
);

const menuItems = document.querySelectorAll(".menu li");


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

});