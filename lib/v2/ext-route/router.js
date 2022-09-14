module.exports = function (router) {
    router.get('/parse/:html', require('./parse'));
    router.get('/:type/:query', require('./api'));
};
