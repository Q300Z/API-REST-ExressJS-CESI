"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const article_routes_1 = __importDefault(require("./routes/article.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const logger_middleware_1 = require("./middlewares/logger.middleware");
const app = (0, express_1.default)();
const port = 3000;
// Middleware pour parser les requêtes JSON
app.use(express_1.default.json());
app.use(logger_middleware_1.logger);
// Route de base
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
app.use('/api', user_routes_1.default);
app.use('/api', article_routes_1.default);
app.use('/auth', auth_routes_1.default);
// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
