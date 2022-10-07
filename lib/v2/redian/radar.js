module.exports = {
    'redian.news': {
        _name: 'Redian',
        '.': [
            {
                title: 'REDIAN新闻',
                docs: 'https://docs.rsshub.app/news.html#redian-news',
                source: ['/category/:name', '/'],
                target: '/redian/:name',
            },
            {
                title: 'REDIAN新闻 - 话题',
                docs: 'https://docs.rsshub.app/news.html#redian-news-topic',
                source: ['/topic/:id', '/'],
                target: '/redian/topic/:id',
            },
        ],
    },
};
