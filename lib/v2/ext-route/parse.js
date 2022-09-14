const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

const baseUrl = 'https://ustc.fun/dl';

module.exports = async (ctx) => {
    const page = ctx.params.html;
    const url = `${baseUrl}/${page}.html`;

    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // CSDN
    const articleList = $('article.blog-list-box a');
    const items = articleList
        .map((_, item) => ({
            title: $(item).find('h4').text(),
            link: $(item).attr('href'),
            description: $(item).find('div.blog-list-content').text(),
            pubDate: parseDate(
                $(item)
                    .find('div.view-time-box')
                    .text()
                    .match(/\d{4}.\d{2}.\d{2}/g)[0]
            ),
        }))
        .get();

    ctx.state.data = {
        title: 'RSSHub - external router API - parse HTML',
        link: baseUrl,
        item: items,
    };
};
