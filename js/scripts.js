const API_KEY = '****************************';

const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news__list');
const formSearch = document.querySelector('.form-search');
const searchTitle = document.querySelector('.search-title');

const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
});

const getData = async url => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    });

    const data = await response.json();

    return data;
};

const getDateCorrectFormat = isoDate => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const fullTime = date.toLocaleString('en-GB', {
       hour: 'numeric',
       minute: 'numeric' 
    });

    return `
        <span class="news__date">
            ${fullDate}
        </span>
        <span class="news__time">
            ${fullTime}
        </span>
    `;
};

const renderCard = data => {
    newsList.innerHTML = '';

    data.forEach(({ title, urlToImage, url, description, publishedAt, author }) => {
        const card = document.createElement('li');
        card.classList.add('news__item');

        card.innerHTML = `
            <a href="${url}" target="_blank" class="news__link">
                <img width="270" height="200" src="${!urlToImage ? 'images/noimage.jpg' : urlToImage }" alt="${title}" class="news__image">
                <h3 class="news__title">
                    ${title || ''}
                </h3>
                <p class="news__description">
                    ${description || ''}
                </p>
                <div class="news__info">
                    <time class="news__datetime" datetime="${publishedAt}">
                        ${getDateCorrectFormat(publishedAt)}
                    </time>
                    <span class="news__author">
                        ${author || ''}
                    </span>
                </div>
            </a>
        `;

        newsList.append(card);
    });
};

const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const loadNews = async () => {
    newsList.innerHTML = '<li class="preload"></li>';

    const countryCode = localStorage.getItem('countryCode') || 'ua';
    choices.setChoiceByValue(countryCode);
    searchTitle.classList.add('hide');
    const data = await getData(`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=sport`);
    renderCard(data.articles);
};

const loadSearch = async (search) => {
    newsList.innerHTML = '<li class="preload"></li>';

    const data = await getData(`https://newsapi.org/v2/everything?q=${search}`);

    searchTitle.classList.remove('hide');
    searchTitle.textContent = `По вашему запросу “${search}” найдено  ${declOfNum(data.articles.length, ['результат', 'результаты', 'результатов'])}`;
    choices.setChoiceByValue('');
    renderCard(data.articles);
};

choicesElem.addEventListener('change', e => {
    const countryCode = e.detail.value;
    localStorage.setItem('countryCode', countryCode);
    loadNews();
});

formSearch.addEventListener('submit', e => {
    e.preventDefault();

    const searchValue = formSearch.search.value;

    loadSearch(searchValue);

    formSearch.reset();
});

loadNews();