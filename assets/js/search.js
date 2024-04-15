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
  searchSuggestionPos = (searchSuggestionPos + 1) % searchSuggestions.length;

  document.getElementById('search-suggestion').innerText =
    searchSuggestions[searchSuggestionPos];
}

window.addEventListener('DOMContentLoaded', async (event) => {
  setInterval(updateSearchSuggestion, 1000);

  const resultsDiv = document.getElementById('search-results');
  const pagefind = await import('/pagefind/pagefind.js');

  document
    .getElementById('search-input')
    .addEventListener('input', async (e) => {
      if (!e.target.value) {
        hideElement('search-empty');
        unhideElement('search-suggestion-wrapper');
        resultsDiv.innerHTML = '';
        return;
      }

      const search = await pagefind.debouncedSearch(e.target.value);

      if (search) {
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

  document.getElementById('search-clear').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
  });

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');

  if (query) {
    document.querySelector('#search input').value = query;
    document.querySelector('#search input').dispatchEvent(new Event('input'));
  }
});

function hideElement(id) {
  document.getElementById(id).classList.add('hidden');
}

function unhideElement(id) {
  document.getElementById(id).classList.remove('hidden');
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
