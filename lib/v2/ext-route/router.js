module.exports = function (router) {
    router.get('/:type/:query', require('./api'));
};
