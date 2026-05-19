document.addEventListener("DOMContentLoaded", () => {
// RESPONSIVIDADE
// BREAKPOINT PADRONIZADO
// AJUSTE MOBILE
const revealItems = document.querySelectorAll(".reveal-item");
const galleries = document.querySelectorAll("[data-gallery]");

function revealWithStagger(items){
items.forEach((item, index) => {
window.setTimeout(() => {
item.classList.add("is-visible");
}, index * 70);
});
}

function getVisibleGalleryCount(totalItems){
if(window.innerWidth <= 767){
return 1;
}

if(window.innerWidth <= 1199){
return Math.min(2, totalItems);
}

return Math.min(4, totalItems);
}

function setupGallery(gallery){
const track = gallery.querySelector(".gallery-track");
const galleryItems = gallery.querySelectorAll("[data-gallery-item]");
const galleryDots = gallery.parentElement.querySelectorAll("[data-gallery-dot]");
const previousButton = gallery.querySelector("[data-gallery-prev]");
const nextButton = gallery.querySelector("[data-gallery-next]");
let activeGalleryIndex = 0;
let visibleCount = getVisibleGalleryCount(galleryItems.length);

function updateGallery(index, shouldWrap = true){
if(!track || !galleryItems.length){
return;
}

visibleCount = getVisibleGalleryCount(galleryItems.length);
const maxStartIndex = Math.max(galleryItems.length - visibleCount, 0);

if(shouldWrap && index < 0){
activeGalleryIndex = maxStartIndex;
}
else if(shouldWrap && index > maxStartIndex){
activeGalleryIndex = 0;
}
else{
activeGalleryIndex = Math.min(Math.max(index, 0), maxStartIndex);
}

track.style.setProperty("--gallery-index", activeGalleryIndex);
track.style.setProperty("--gallery-visible", visibleCount);
track.classList.toggle("is-carousel", galleryItems.length > visibleCount);

galleryItems.forEach((item, itemIndex) => {
const isVisible = itemIndex >= activeGalleryIndex && itemIndex < activeGalleryIndex + visibleCount;
item.classList.toggle("active", itemIndex === activeGalleryIndex);
item.setAttribute("aria-hidden", isVisible ? "false" : "true");
});

galleryDots.forEach((dot, dotIndex) => {
dot.classList.toggle("active", dotIndex === activeGalleryIndex);
dot.hidden = dotIndex > maxStartIndex;
});
}

galleryItems.forEach((item, index) => {
item.addEventListener("click", () => updateGallery(index, false));
});

galleryDots.forEach((dot, index) => {
dot.addEventListener("click", () => updateGallery(index, false));
});

if(previousButton){
previousButton.addEventListener("click", () => updateGallery(activeGalleryIndex - 1));
}

if(nextButton){
nextButton.addEventListener("click", () => updateGallery(activeGalleryIndex + 1));
}

window.addEventListener("resize", () => updateGallery(activeGalleryIndex, false));
updateGallery(0);
}

galleries.forEach(gallery => setupGallery(gallery));

if(!("IntersectionObserver" in window)){
revealItems.forEach(item => item.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
const group = entry.target.parentElement.querySelectorAll(".reveal-item:not(.is-visible)");

if(group.length > 1){
revealWithStagger(Array.from(group));
}
else{
entry.target.classList.add("is-visible");
}

observer.unobserve(entry.target);
}
});
}, {
threshold:0.16
});

revealItems.forEach(item => observer.observe(item));
});
