document.addEventListener("DOMContentLoaded", () => {

const sections = document.querySelectorAll(
"body[id], section[id]"
);

const menuLinks = document.querySelectorAll(
'.menu a, .footer a[href="#topo"]'
);

const menuItems = document.querySelectorAll(".menu li");


// SCROLL SUAVE

menuLinks.forEach(link => {

link.addEventListener("click", e => {

const targetId = link.getAttribute("href");

if(!targetId.startsWith("#")) return;

e.preventDefault();

const target = document.querySelector(targetId);

if(target){

target.scrollIntoView({
behavior:"smooth",
block:"start"
});

}

});

});

// TRAÇO ATIVO

window.addEventListener("scroll", () => {

let current = "topo";

sections.forEach(section => {

const sectionTop = section.offsetTop - 180;
const sectionHeight = section.offsetHeight;

if(
window.scrollY >= sectionTop &&
window.scrollY < sectionTop + sectionHeight
){
current = section.id;
}

});

menuItems.forEach(item => {

item.classList.remove("active");

const link = item.querySelector("a");

if(
link &&
link.getAttribute("href") === `#${current}`
){
item.classList.add("active");
}

});

});

});