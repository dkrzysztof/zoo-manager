module.exports.newFunc = function(req, res) {
    res.json({
        hello: 'HELLO WORLD'
    });
};

module.exports.logIn = function(req, res) {
    console.log(req.server.sequelize);
};
