const { isEmpty } = require('./lib');
module.exports = function(req, res, next) {
    console.log(`[${req.method}]: ${req.url}`);
    if (req.body && !isEmpty(req.body)) {
        console.log('BODY\t: ', req.body);
    }
    next();
};
