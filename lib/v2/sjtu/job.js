const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

const arr = {
    zprd: 'eweb/jygl/zpfw.so?modcode=jygl_scfwzpxx&subsyscode=zpfw&type=searchZprd&sysType=TPZPFW', // gov.
    zpxx: 'eweb/jygl/zpfw.so?modcode=jygl_zpxxck&subsyscode=zpfw&type=searchZpxx&zpxxType=new', // industry
    kzxj: 'eweb/jygl/zpfw.so?modcode=jygl_xjhxxck&subsyscode=zpfw&type=searchXjhxx&xjhType=kzxj',
};

const baseUrl = 'https://www.job.sjtu.edu.cn/';

module.exports = async (ctx) => {
    const type = ctx.params.type ?? 'zpxx';
    const rootUrl = baseUrl + arr[type];

    const list_response = await got(rootUrl);
    const $ = cheerio.load(list_response.data);

    const zpxx_viewUrl = 'https://www.job.sjtu.edu.cn/eweb/jygl/zpfw.so?modcode=jygl_scfwzpxx&subsyscode=zpfw&type=viewZpxx&id=';

    const feed_title = '上海交通大学 学生就业服务与职业发展中心 - 招聘信息';

    const entryList = $('div.z_newsl li')
        .map((_, item) => {
            item = $(item);
            const employer = item.find('a')[0];
            const title = item.find('a')[1];
            const dateEntry = item.find('div')[2];
            const date = parseDate($(dateEntry).text());
            const uid = new String($(employer).attr('onclick')).split("'")[1];
            const entry = {
                title: $(title).text(),
                link: zpxx_viewUrl + uid,
                description: '<p>' + $(employer).text() + '</p>\n',
                pubDate: date,
            };
            return entry;
        })
        .get()
        .slice(1, 11);

    const sortedList = entryList.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()).slice(0, 50);

    ctx.state.data = {
        title: feed_title,
        link: rootUrl,
        item: await Promise.all(
            sortedList.map((item) =>
                ctx.cache.tryGet(item.link, async () => {
                    const detail_page = await got(item.link);
                    const detail = cheerio.load(detail_page.data);
                    item.description += detail('td#tdnr').html();
                    return item;
                })
            )
        ),
    };
};
