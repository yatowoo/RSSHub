const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

const baseUrl = 'https://redian.news';

module.exports = async (ctx) => {
    const topicID = ctx.params.id ?? '110';
    const pageID = ctx.params.page ?? '1';
    const rootUrl = `${baseUrl}/topics/${topicID}?pg=${pageID}`;

    const list_response = await got(rootUrl);
    const $ = cheerio.load(list_response.data);

    const feed_title = $('div.font-semibold.text-2xl').text();

    const entry_list = $('div.relative li.ant-timeline-item')
        .map((_, item) => {
            item = $(item);
            const a = item.find('a');
            const date = parseDate(item.find('time').attr('title'));
            return {
                title: a.text(),
                link: new URL(a.attr('href'), baseUrl),
                pubDate: date,
                description: item.find('p').text(),
            };
        })
        .get();

    ctx.state.data = {
        title: `REDIAN新闻 - ${feed_title}`,
        link: rootUrl,
        item: entry_list,
    };
};
