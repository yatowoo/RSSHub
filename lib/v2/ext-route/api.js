// const got = require('@/utils/got');
// const cheerio = require('cheerio');
const { finishArticleItem } = require('@/utils/wechat-mp');
// const { parseDate } = require('@/utils/parse-date');

const baseUrl = 'https://rsshub.app';

module.exports = async (ctx) => {
    const type = ctx.params.type;
    const querystring = ctx.params.query;
    // Wechat
    let entry = {};
    if (type === 'wechat') {
        let url;
        if (querystring.startsWith('__biz=')) {
            // Full url by app share
            url = 'https://mp.weixin.qq.com/s?' + querystring;
        } else {
            // Short url from backend
            url = 'https://mp.weixin.qq.com/s/' + querystring;
        }
        entry = await finishArticleItem(ctx, { link: url });
    } else {
        throw new Error('ext-route : Unknown type');
    }

    ctx.state.data = {
        title: 'RSSHub - external router API',
        link: baseUrl,
        item: [entry],
    };
};
