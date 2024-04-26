const searchSuggestions = [
  'Docker',
  'JavaScript',
  'NodeJS',
  'Databases',
  'Linux',
  'CSS',
];
let searchSuggestionPos = 0;

function updateSearchSuggestion() {
  const searchSuggestionDiv = document.getElementById('search-suggestion');

  if (!searchSuggestionDiv) return;
  searchSuggestionPos = (searchSuggestionPos + 1) % searchSuggestions.length;

  searchSuggestionDiv.innerText = searchSuggestions[searchSuggestionPos];
}

window.addEventListener('DOMContentLoaded', async () => {
  setInterval(updateSearchSuggestion, 1000);

  const resultsDiv = document.getElementById('search-results');
  // @ts-ignore
  const pagefind = await import('/pagefind/pagefind.js');

  document
    .getElementById('search-input')
    ?.addEventListener('input', async (e) => {
      if (resultsDiv && !(e.target as HTMLInputElement).value) {
        hideElement('search-empty');
        unhideElement('search-suggestion-wrapper');
        resultsDiv.innerHTML = '';
        return;
      }

      const search = await pagefind.debouncedSearch(
        (e.target as HTMLInputElement).value
      );

      if (resultsDiv && search) {
        hideElement('search-suggestion-wrapper');
        resultsDiv.innerHTML = '';
      }

      if (search?.results?.length) {
        hideElement('search-empty');
        renderResults(resultsDiv, search.results);
      } else {
        unhideElement('search-empty');
      }
    });

  document.getElementById('search-clear')?.addEventListener('click', () => {
    (document.getElementById('search-input') as HTMLInputElement).value = '';
  });

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  const searchInputDiv = document.querySelector(
    '#search input'
  ) as HTMLInputElement;

  if (searchInputDiv && query) {
    searchInputDiv.value = query;
    searchInputDiv.dispatchEvent(new Event('input'));
  }
});

function hideElement(id) {
  document.getElementById(id)?.classList.add('hidden');
}

function unhideElement(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

async function renderResults(target, results) {
  for (const result of results) {
    const resultData = await result.data();

    const post = createElement('div', ['list-item'], target);
    const postContentWrapper = createElement(
      'div',
      ['list-item-content-wrapper'],
      post
    );
    const postImgWrapper = createElement(
      'div',
      ['list-item-img-wrapper'],
      postContentWrapper
    );
    const postImg = createElement('div', ['list-item-img'], postImgWrapper);
    const img = createElement('img', null, postImg);
    img['src'] = resultData.meta.image;
    console.log('img src', resultData.meta.image);
    const postTitleSummaryWrapper = createElement(
      'div',
      ['list-item-title-summary-wrapper'],
      postContentWrapper
    );
    const postTitle = createElement(
      'h2',
      ['list-item-title'],
      postTitleSummaryWrapper
    );
    const postLink = createElement('a', null, postTitle, resultData.meta.title);
    postLink['href'] = resultData.url;
    createElement(
      'div',
      ['list-item-summary'],
      postTitleSummaryWrapper,
      resultData.excerpt
    );
  }
}

function createElement(type, cls, parent, content = null) {
  const el = document.createElement(type);

  if (cls && cls.length) {
    el.classList.add(...cls);
  }

  if (content) {
    el.innerHTML = content;
  }

  parent.appendChild(el);

  return el;
}
