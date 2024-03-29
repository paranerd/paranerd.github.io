document.addEventListener(
  'DOMContentLoaded',
  () => {
    const header = document.getElementsByTagName('header')[0];
    const mastheadHomepage = document.getElementById('masthead-homepage');
    const arrowDown = document.getElementById('arrow-down');
    const skillBars = document.getElementsByClassName('skill-bar');

    window.addEventListener('scroll', () => {
      if (mastheadHomepage) {
        mastheadHomepage.style.opacity =
          1 - window.scrollY / (window.innerHeight / 2);
        mastheadHomepage.style.marginTop = -window.scrollY / 2 + 'px';
      }

      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (skillBars) {
        for (let bar of skillBars) {
          if (isInViewport(bar)) {
            setTimeout(() => {
              const actualSkill =
                bar.getElementsByClassName('skill-bar-actual')[0];
              actualSkill.style.width = actualSkill.style.maxWidth;
            }, 500);
          }
        }
      }
    });

    if (arrowDown) {
      arrowDown.addEventListener('click', () => {
        window.scroll({
          top: window.innerHeight,
          left: 0,
          behavior: 'smooth',
        });
      });
    }

    function isInViewport(elem) {
      const rect = elem.getBoundingClientRect();
      const html = document.documentElement;

      return (
        rect.top < (window.innerHeight || html.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || html.clientWidth) &&
        rect.right > 0
      );
    }

    document.getElementById('nav-icon').addEventListener('click', (e) => {
      document.getElementById('nav-icon').classList.toggle('open');
      document.getElementById('flyout').classList.toggle('open');
    });
  },
  false
);
