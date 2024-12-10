"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_routes_1 = require("./routes/user.routes");
var article_routes_1 = require("./routes/article.routes");
var auth_routes_1 = require("./routes/auth.routes");
var logger_middleware_1 = require("./middlewares/logger.middleware");
var app = (0, express_1.default)();
var port = 3000;
// Middleware pour parser les requêtes JSON
app.use(express_1.default.json());
app.use(logger_middleware_1.logger);
// Route de base
app.get('/', function (req, res) {
    res.send('Hello, TypeScript with Express!');
});
app.use('/api', user_routes_1.default);
app.use('/api', article_routes_1.default);
app.use('/auth', auth_routes_1.default);
// Lancer le serveur
app.listen(port, function () {
    console.log("Serveur d\u00E9marr\u00E9 sur http://localhost:".concat(port));
});
