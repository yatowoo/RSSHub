const got = require('@/utils/got');
const cheerio = require('cheerio');
// const { parseDate } = require('@/utils/parse-date');

const baseUrl = 'https://redian.news';

module.exports = async (ctx) => {
    const categoryName = ctx.params.category ?? '';
    const subpath = categoryName === '' ? '' : `/categories/${categoryName}`;
    const rootUrl = baseUrl + subpath;

    const list_response = await got(rootUrl);
    const $ = cheerio.load(list_response.data);

    const feed_title = categoryName === '' ? '' : ` - ${categoryName}`;

    const entry_list = $('div.w-full > div > a')
        .map((_, item) => {
            item = $(item);
            // const date = parseDate(item.find('time').attr('title'));
            return {
                title: item.find('span').text(),
                link: new URL(item.attr('href'), baseUrl),
                // pubDate: date, # require detail page
                // description: item.find('p').text(), # require detail page
            };
        })
        .get();

    ctx.state.data = {
        title: 'REDIAN新闻' + feed_title,
        link: rootUrl,
        item: entry_list,
    };
};
