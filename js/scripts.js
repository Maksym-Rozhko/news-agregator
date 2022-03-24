const API_KEY = '***************************';

const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news__list');

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

const renderCard = data => {
    newsList.innerHTML = '';

    data.forEach(({ title, urlToImage, url, description, publishedAt, author }) => {
        const card = document.createElement('li');
        card.classList.add('news__item');

        card.innerHTML = `
            <a href="${url}" target="_blank" class="news__link">
                <img src="${!urlToImage ? 'images/news-img.jpg' : urlToImage }" alt="${title}" class="news__image">
                <h3 class="news__title">
                    ${title}
                </h3>
                <p class="news__description">
                    ${description}
                </p>
                <div class="news__info">
                    <time class="news__datetime" datetime="${publishedAt}">
                        <span class="news__date">
                            ${publishedAt}
                        </span>
                        <span class="news__time">
                            11:06
                        </span>
                    </time>
                    <span class="news__author">
                        ${author}
                    </span>
                </div>
            </a>
        `;

        newsList.append(card);
    });
};

const loadNews = async () => {
    const data = await getData('https://newsapi.org/v2/top-headlines?country=ru');
    renderCard(data.articles);
};

loadNews();