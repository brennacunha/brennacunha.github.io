document.addEventListener("DOMContentLoaded", () => {
const revealItems = document.querySelectorAll(".reveal-item");

if(!("IntersectionObserver" in window)){
revealItems.forEach(item => item.classList.add("is-visible"));
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
threshold:0.18
});

revealItems.forEach(item => observer.observe(item));
});
