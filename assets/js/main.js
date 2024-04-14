document.addEventListener(
  'DOMContentLoaded',
  () => {
    const header = document.getElementsByTagName('header')[0];
    const mastheadHomepage = document.getElementById('masthead-homepage');
    const mastheadSubtitle = document.getElementById('masthead-subtitle');
    const skillBars = document.getElementsByClassName('skill-bar');

    if (mastheadHomepage && window.scrollY === 0) {
      mastheadHomepage.classList.add('fadeInUp');
      mastheadSubtitle.classList.add('fadeIn');
    }

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

    setupFlyoutMenu();
    setupArrowDown();
    setupCategories();
    setupCollapsibles();
    setupCopyButtons();
  },
  false
);

function setupFlyoutMenu() {
  document.getElementById('nav-icon').addEventListener('click', (e) => {
    document.getElementById('nav-icon').classList.toggle('open');
    document.getElementById('flyout').classList.toggle('open');
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

function setupCategories() {
  const categories = document.querySelectorAll('.category');

  categories.forEach((el) =>
    el.addEventListener('click', (event) => {
      // Remove 'active' class from all categories
      document
        .querySelectorAll('.category')
        .forEach((el) => el.classList.remove('active'));

      // Set current category active
      event.target.classList.add('active');
      showProjectsByCategory(event.target.dataset.category);
    })
  );

  function showProjectsByCategory(category) {
    document.querySelectorAll('.project').forEach((el) => {
      const elementCategories = el.dataset.categories
        .split(',')
        .filter((el) => el);

      if (category === 'all' || elementCategories.includes(category)) {
        el.classList.remove('soft-hide');
      } else {
        el.classList.add('soft-hide');
      }
    });
  }
}
function setupCollapsibles() {
  const collapser = document.querySelectorAll('.collapser');

  collapser.forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = document.getElementById(event.target.dataset.target);

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

function setupCopyButtons() {
  document.querySelectorAll('pre > code').forEach((codeblock) => {
    const container = codeblock.parentNode.parentNode;

    const copybutton = document.createElement('button');
    copybutton.classList.add('copy-code', 'light');
    copybutton.innerText = 'Copy';

    function copyingDone() {
      copybutton.innerText = 'Copied!';
      setTimeout(() => {
        copybutton.innerText = 'Copy';
      }, 2000);
    }

    copybutton.addEventListener('click', () => {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(codeblock.textContent);
        copyingDone();
      }
    });

    if (container.classList.contains('highlight')) {
      container.appendChild(copybutton);
    } else if (container.parentNode.firstChild == container) {
      // td containing LineNos
    } else if (
      codeblock.parentNode.parentNode.parentNode.parentNode.parentNode
        .nodeName == 'TABLE'
    ) {
      // table containing LineNos and code
      codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(
        copybutton
      );
    } else {
      // code blocks not having highlight as parent class
      codeblock.parentNode.appendChild(copybutton);
    }
  });
}

window.onContactFormSubmit = function () {
  const form = document.getElementById('contact-form');
  form.submit();
  form.reset();

  const submitResponseEl = document.getElementById(
    'contact-form-submit-response'
  );

  submitResponseEl.classList.add('reveal');

  setTimeout(() => {
    submitResponseEl.classList.remove('reveal');
  }, 2000);
};
