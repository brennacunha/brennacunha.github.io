document.addEventListener("DOMContentLoaded", () => {
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".portfolio-card");
const revealCards = document.querySelectorAll(".reveal-card");
let filterTimers = [];

function revealVisibleCards(){
revealCards.forEach((card, index) => {
const revealTimer = window.setTimeout(() => {
if(!card.classList.contains("is-filtered-out")){
card.classList.add("is-visible");
}
}, index * 60);

filterTimers.push(revealTimer);
});
}

function clearFilterTimers(){
filterTimers.forEach(timer => window.clearTimeout(timer));
filterTimers = [];
}

filterButtons.forEach(button => {
button.addEventListener("click", () => {
const filter = button.dataset.filter;
const visibleCards = [];

clearFilterTimers();

filterButtons.forEach(item => item.classList.remove("active"));
button.classList.add("active");

projectCards.forEach(card => {
const isMatch = filter === "todos" || card.dataset.category === filter;

card.classList.remove("is-visible");
card.classList.remove("is-filtered-out");
card.classList.add("is-hidden");

const hideTimer = window.setTimeout(() => {
card.classList.toggle("is-filtered-out", !isMatch);

if(isMatch){
visibleCards.push(card);
card.classList.remove("is-hidden");
}
}, 180);

filterTimers.push(hideTimer);
});

const revealTimer = window.setTimeout(() => {
visibleCards.forEach((card, index) => {
const staggerTimer = window.setTimeout(() => {
card.classList.add("is-visible");
}, index * 60);

filterTimers.push(staggerTimer);
});
}, 210);

filterTimers.push(revealTimer);
});
});

if(!("IntersectionObserver" in window)){
revealCards.forEach(card => card.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});
}, {
threshold:0.16
});

revealCards.forEach(card => observer.observe(card));
revealVisibleCards();
});
