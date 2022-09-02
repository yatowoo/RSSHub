const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');

const JOB_TYPE = {
    postdoc: 'POSTDOC',
};

module.exports = async (ctx) => {
    const jobType = ctx.params.type ?? 'postdoc';

    const rootUrl = 'https://inspirehep.net';

    // sort, size, page, filed_of_interest, rank, region, format
    const queryArgs = 'sort=mostrecent&size=25&page=1&field_of_interest=hep-ex&field_of_interest=nucl-ex&field_of_interest=physics.ins-det&region=Asia&region=Europe&format=json' + `&rank=${JOB_TYPE[jobType]}`;

    const apiUrl = `${rootUrl}/api/jobs?${queryArgs}`;

    const response = await got(apiUrl);

    ctx.state.data = {
        title: 'iNSPIRE HEP - Job Search',
        link: rootUrl,
        item: await Promise.all(
            response.data.hits.hits.map((item) =>
                ctx.cache.tryGet(item.links.json, () => {
                    const entry = {
                        title: item.metadata.institutions[0].value + ' - ' + item.metadata.position,
                        link: `${rootUrl}/jobs/${item.id}`,
                        pubDate: parseDate(item.updated),
                        description: item.metadata.description,
                    };
                    return entry;
                })
            )
        ),
    };
};
