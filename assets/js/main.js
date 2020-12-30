const main = document.getElementById('main');
const heading = document.getElementById('heading');
const arrowDown = document.getElementById('arrow-down');
const body = document.getElementById('main');
const height = main.offsetHeight;

window.addEventListener('scroll', (e) => {
    heading.style.opacity = 1 - window.scrollY / (height / 2);
});

arrowDown.addEventListener('click', (e) => {
    window.scroll({
        top: height,
        left: 0,
        behavior: "smooth",
    });
});