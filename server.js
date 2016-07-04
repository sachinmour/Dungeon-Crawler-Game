require('babel-core/register');
var path = require('path');
var express = require('express'),
    server_routes = require("./app/server_routes/routes");
var app = express();
var PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('./webpack.config.js');
    var compiler = webpack(config);
    var morgan = require('morgan');
    app.use(morgan('dev'));
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
}
app.use(express.static(path.join(__dirname, '/public')));
server_routes(app);
app.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    }
});
