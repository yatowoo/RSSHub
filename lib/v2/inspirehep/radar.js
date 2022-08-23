module.exports = {
    'inspirehep.net': {
        _name: 'InspireHEP',
        '.': [
            {
                title: 'Academic jobs',
                docs: 'https://docs.rsshub.app/',
                source: ['/:type', '/'],
                target: '/inspirehep/job/:type',
            },
        ],
    },
};
