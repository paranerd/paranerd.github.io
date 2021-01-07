const main = document.getElementById('main');
const heading = document.getElementById('heading');
const arrowDown = document.getElementById('arrow-down');
const body = document.getElementById('main');
const height = main.offsetHeight;
const skillBars = document.getElementsByClassName('skill-bar');

window.addEventListener('scroll', (e) => {
    heading.style.opacity = 1 - window.scrollY / (height / 2);
    heading.style.marginTop = -window.scrollY / 2 + "px";

    for (let bar of skillBars) {
        if (isInViewport(bar)) {
            setTimeout(() => {
                const actualSkill = bar.getElementsByClassName('skill-bar-actual')[0]
                actualSkill.style.width = actualSkill.style.maxWidth;
            }, 500);
        }
    };
});

arrowDown.addEventListener('click', (e) => {
    window.scroll({
        top: height,
        left: 0,
        behavior: "smooth",
    });
});

function isInViewport(elem) {
    const rect  = elem.getBoundingClientRect();
    const html = document.documentElement;

    return (
        rect.top < (window.innerHeight || html.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || html.clientWidth) &&
        rect.right > 0
    );
}