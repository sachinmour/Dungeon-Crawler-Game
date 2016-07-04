var path = require('path');

module.exports = function(app, passport) {

    app.get('/*', function(req, res) {
        // serverRender.handleRender(req, res);
        res.sendFile(path.join(__dirname, '../../public/index2.html'));
    });

};
