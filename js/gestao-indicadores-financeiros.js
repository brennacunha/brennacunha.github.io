document.addEventListener("DOMContentLoaded", () => {
// RESPONSIVIDADE
// BREAKPOINT PADRONIZADO
// AJUSTE MOBILE
const revealItems = document.querySelectorAll(".reveal-item");
const galleries = document.querySelectorAll("[data-gallery]");
const galleryLightbox = createGalleryLightbox();
let activeLightboxItems = [];
let activeLightboxIndex = 0;

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

function createGalleryLightbox(){
const lightbox = document.createElement("div");
lightbox.className = "project-lightbox";
lightbox.hidden = true;
lightbox.innerHTML = `
<div class="project-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Imagem ampliada da galeria">
<button class="project-lightbox__close" type="button" aria-label="Fechar imagem ampliada">×</button>
<button class="project-lightbox__nav project-lightbox__nav--prev" type="button" aria-label="Imagem anterior">‹</button>
<img class="project-lightbox__image" src="" alt="Imagem ampliada da galeria">
<button class="project-lightbox__nav project-lightbox__nav--next" type="button" aria-label="Próxima imagem">›</button>
<span class="project-lightbox__counter" aria-live="polite"></span>
</div>`;
document.body.appendChild(lightbox);

return {
root:lightbox,
image:lightbox.querySelector(".project-lightbox__image"),
closeButton:lightbox.querySelector(".project-lightbox__close"),
previousButton:lightbox.querySelector(".project-lightbox__nav--prev"),
nextButton:lightbox.querySelector(".project-lightbox__nav--next"),
counter:lightbox.querySelector(".project-lightbox__counter")
};
}

function getGallerySources(galleryItems){
return Array.from(galleryItems).map((item, index) => {
const image = item.querySelector("img");

if(!image){
return null;
}

const label = item.querySelector("span")?.textContent?.trim() || `Imagem ${index + 1}`;

return {
src:image.currentSrc || image.src,
alt:image.alt || label,
label
};
}).filter(Boolean);
}

function renderLightbox(){
const currentItem = activeLightboxItems[activeLightboxIndex];

if(!currentItem){
return;
}

galleryLightbox.image.src = currentItem.src;
galleryLightbox.image.alt = currentItem.alt;
galleryLightbox.counter.textContent = `${activeLightboxIndex + 1} / ${activeLightboxItems.length}`;
const hasNavigation = activeLightboxItems.length > 1;
galleryLightbox.previousButton.hidden = !hasNavigation;
galleryLightbox.nextButton.hidden = !hasNavigation;
}

function openLightbox(items, index){
if(!items.length){
return;
}

activeLightboxItems = items;
activeLightboxIndex = Math.min(Math.max(index, 0), items.length - 1);
galleryLightbox.root.hidden = false;
galleryLightbox.root.classList.add("is-open");
document.body.style.overflow = "hidden";
renderLightbox();
galleryLightbox.closeButton.focus();
}

function closeLightbox(){
galleryLightbox.root.classList.remove("is-open");
galleryLightbox.root.hidden = true;
galleryLightbox.image.src = "";
activeLightboxItems = [];
document.body.style.overflow = "";
}

function moveLightbox(step){
if(activeLightboxItems.length <= 1){
return;
}

activeLightboxIndex = (activeLightboxIndex + step + activeLightboxItems.length) % activeLightboxItems.length;
renderLightbox();
}

galleryLightbox.closeButton.addEventListener("click", closeLightbox);
galleryLightbox.previousButton.addEventListener("click", () => moveLightbox(-1));
galleryLightbox.nextButton.addEventListener("click", () => moveLightbox(1));
galleryLightbox.root.addEventListener("click", event => {
if(event.target === galleryLightbox.root){
closeLightbox();
}
});

document.addEventListener("keydown", event => {
if(galleryLightbox.root.hidden){
return;
}

if(event.key === "Escape"){
closeLightbox();
}
else if(event.key === "ArrowLeft"){
moveLightbox(-1);
}
else if(event.key === "ArrowRight"){
moveLightbox(1);
}
});

function setupGallery(gallery){
const track = gallery.querySelector(".gallery-track");
const galleryItems = gallery.querySelectorAll("[data-gallery-item]");
const galleryDots = gallery.parentElement.querySelectorAll("[data-gallery-dot]");
const previousButton = gallery.querySelector("[data-gallery-prev]");
const nextButton = gallery.querySelector("[data-gallery-next]");
let activeGalleryIndex = 0;
let visibleCount = getVisibleGalleryCount(galleryItems.length);
let swipeStartX = 0;
let swipeStartY = 0;
let isSwiping = false;
let ignoreGalleryClick = false;

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
item.addEventListener("click", event => {
if(ignoreGalleryClick){
event.preventDefault();
ignoreGalleryClick = false;
return;
}

updateGallery(index, false);
const galleryImages = getGallerySources(galleryItems);

if(galleryImages.length){
openLightbox(galleryImages, index);
}
});
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

if(track){
track.addEventListener("pointerdown", event => {
swipeStartX = event.clientX;
swipeStartY = event.clientY;
isSwiping = true;
});

track.addEventListener("pointerup", event => {
if(!isSwiping){
return;
}

const deltaX = event.clientX - swipeStartX;
const deltaY = event.clientY - swipeStartY;
isSwiping = false;

if(Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)){
return;
}

ignoreGalleryClick = true;
updateGallery(activeGalleryIndex + (deltaX < 0 ? 1 : -1));
});

track.addEventListener("pointercancel", () => {
isSwiping = false;
});
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
