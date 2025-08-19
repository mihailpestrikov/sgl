document.addEventListener('DOMContentLoaded', () => {
    const newsList = document.getElementById('news-list');
    const preloader = document.getElementById('preloader');

    const renderPosts = (posts) => {
        newsList.innerHTML = '';

        if (!posts || posts.length === 0) {
            newsList.innerHTML = `<div class="error">Что-то пошло не так: Empty data</div>`;
            return;
        }

        posts.forEach((post) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            `;
            newsList.appendChild(newsItem);
        });
    };

    const fetchData = (start, end) => {
        return new Promise((resolve, reject) => {
            fetch(`https://jsonplaceholder.typicode.com/posts`)
                .then((response) => {
                    if (!response.ok) {
                        reject(new Error(`HTTP error status: ${response.status}`));
                    }
                    return response.json();
                })
                .then((data) => {
                    const filteredData = data.filter(post => post.id >= start && post.id <= end);
                    resolve(filteredData);
                })
                .catch((error) => reject(error));
        });
    };

    const getRandomRange = () => {
        const start = Math.floor(Math.random() * 91) + 1;
        const end = start + 9;
        return { start, end };
    };

    const fetchAndRender = async () => {
        preloader.style.display = 'block';

        const { start, end } = getRandomRange();

        fetchData(start, end)
            .then((posts) => {
                setTimeout(() => {
                    preloader.style.display = 'none';
                    renderPosts(posts);
                }, 3000);
            })
            .catch((error) => {
                preloader.style.display = 'none';
                newsList.innerHTML = `<div class="error">Что-то пошло не так: ${error.message}</div>`;
            });
    };

    fetchAndRender();
});
