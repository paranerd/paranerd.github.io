interface Window {
  onContactFormSubmit: Function;
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const header = document.getElementsByTagName('header')[0];
    const skillBars = document.getElementsByClassName('skill-bar');
    const parallax = document.querySelectorAll('.parallax') as NodeListOf<HTMLElement>;

    if (window.scrollY === 0) {
      const fadeInUp = document.querySelectorAll('.do-fade-in-up') as NodeListOf<HTMLElement>;

      fadeInUp.forEach((el) => {
        el.classList.add('fade-in-up');
      });
    
      const fadeInOut = document.querySelectorAll('.do-fade-in-out') as NodeListOf<HTMLElement>;
  
      fadeInOut.forEach((el) => {
        el.classList.add('fade-in-out');
      });
    }

    window.addEventListener('scroll', () => {
      if (parallax.length) {
        parallax.forEach((el) => {
          el.style.opacity = String(
            1 - window.scrollY / (window.innerHeight / 2)
          );
          el.style.marginTop = -window.scrollY / 2 + 'px';
        });
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
              const actualSkill = bar.getElementsByClassName(
                'skill-bar-actual'
              )[0] as HTMLElement;
              actualSkill.style.width = actualSkill.style.maxWidth;
            }, 500);
          }
        }
      }
    });

    setupFlyoutMenu();
    setupArrowDown();
    setupCollapsibles();
  },
  false
);

function setupFlyoutMenu() {
  document.getElementById('nav-icon')?.addEventListener('click', (e) => {
    document.getElementById('nav-icon')?.classList.toggle('open');
    document.getElementById('flyout')?.classList.toggle('open');
  });
}

function setupArrowDown() {
  const arrowDown = document.getElementById('arrow-down');

  if (arrowDown) {
    arrowDown.addEventListener('click', () => {
      window.scroll({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth',
      });
    });
  }
}

function setupCollapsibles() {
  const collapser = document.querySelectorAll('.collapser');

  collapser.forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = document.getElementById(
        (event.target as HTMLElement)?.dataset.target ?? ''
      ) as HTMLElement;

      el.classList.toggle('collapsed');
      target.classList.toggle('collapsed');
      target.style.maxHeight = target.classList.contains('collapsed')
        ? '0'
        : `${target.scrollHeight}px`;
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

window.onContactFormSubmit = function () {
  const form = document.getElementById('contact-form') as HTMLFormElement;
  form.submit();
  form.reset();

  const submitResponseEl = document.getElementById(
    'contact-form-submit-response'
  );

  submitResponseEl?.classList.add('reveal');

  setTimeout(() => {
    submitResponseEl?.classList.remove('reveal');
  }, 2000);
};
