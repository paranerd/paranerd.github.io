document.addEventListener('DOMContentLoaded', () => {
  setupCopyButtons();
});

function setupCopyButtons() {
  document.querySelectorAll('pre > code').forEach((codeblock) => {
    const container = codeblock.parentNode?.parentNode;

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
        navigator.clipboard.writeText(codeblock.textContent ?? '');
        copyingDone();
      }
    });

    if (
      container &&
      (container as HTMLElement).classList.contains('highlight')
    ) {
      container.appendChild(copybutton);
    } else if (container?.parentNode?.firstChild == container) {
      // td containing LineNos
    } else if (
      codeblock.parentNode?.parentNode?.parentNode?.parentNode?.parentNode
        ?.nodeName == 'TABLE'
    ) {
      // table containing LineNos and code
      codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(
        copybutton
      );
    } else {
      // code blocks not having highlight as parent class
      codeblock.parentNode?.appendChild(copybutton);
    }
  });
}
