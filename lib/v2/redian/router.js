module.exports = function (router) {
    router.get('/:category?', require('./index'));
    router.get('/topic/:id?/:page?', require('./topic'));
};
