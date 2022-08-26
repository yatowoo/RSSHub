const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

const typeTitle = {
    zwxx: '校招职位', // no
    zpxx: '日常招聘', // industry
    zph: '招聘会',
    xjh: '宣讲会',
    gwyzk: '公务员招考',
    zxzp: '专项招聘', // 事业单位
    sxzp: '实习招聘', //
    kykg: '考研升学',
    sxh: '地方双选',
};

// const homeUrl = 'http://jycy.fzu.edu.cn/cms';
const baseUrl = 'http://59.77.226.111';

module.exports = async (ctx) => {
    const type = ctx.params.type ?? 'zpxx';
    const rootUrl = baseUrl + '/cmss/' + type;

    const queryArgs = 'page=1';

    const list_response = await got(`${rootUrl}?${queryArgs}`);
    const $ = cheerio.load(list_response.data);

    const feed_title = '福州大学 学生就业创业指导中心 - ' + typeTitle[type];

    const entryList = $('div.am-tab-panel > ul > li > a')
        .map((_, item) => {
            item = $(item);
            const entry_id = new String(item.attr('href')).split('/')[3];
            const employer = item.find('p.jobinfo');
            const title = item.find('p.company');
            const dateEntry = item.find('span.jobxjht');
            const dateYear = $(dateEntry).find('p').text();
            const dateText = dateYear + '-' + $(dateEntry).text().trim().replace(dateYear, '');
            const date = parseDate(dateText);
            const entry = {
                title: $(title).text(),
                link: `${rootUrl}/${entry_id}`,
                description: '<p>' + $(employer).text() + '</p>\n',
                pubDate: date,
            };
            return entry;
        })
        .get();

    const sortedList = entryList.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    ctx.state.data = {
        title: feed_title,
        link: rootUrl,
        item: await Promise.all(
            sortedList.map((item) =>
                ctx.cache.tryGet(item.link, async () => {
                    const detail_page = await got(item.link);
                    const detail = cheerio.load(detail_page.data);
                    item.description += detail('div.am-tab-panel').html();
                    return item;
                })
            )
        ),
    };
};
