"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticlesByUserId = exports.getAllArticles = exports.createArticle = void 0;
var article_model_1 = require("../models/article.model");
var user_model_1 = require("../models/user.model");
// CREATE: Ajouter un nouvel article
var createArticle = function (req, res) {
    var _a = req.body, userId = _a.userId, titre = _a.titre, contenu = _a.contenu;
    if (!userId || !titre || !contenu) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }
    var userExists = user_model_1.users.some(function (user) { return user.id === userId; });
    if (!userExists) {
        res.status(404).json({ error: "Utilisateur n'existe pas" });
        return;
    }
    var newArticle = {
        id: article_model_1.articles.length + 1,
        userId: userId,
        titre: titre,
        contenu: contenu,
    };
    article_model_1.articles.push(newArticle);
    res.status(201).json({ message: "Article créer avec succès !", data: newArticle });
};
exports.createArticle = createArticle;
// READ: Récupérer tous les articles
var getAllArticles = function (req, res) {
    res.json(article_model_1.articles);
};
exports.getAllArticles = getAllArticles;
// READ: Récupérer les articles d'un utilisateur
var getArticlesByUserId = function (req, res) {
    var userId = parseInt(req.params.userId);
    var userArticles = article_model_1.articles.filter(function (article) { return article.userId === userId; });
    if (userArticles.length === 0) {
        res.status(404).json({ error: "Aucun article trouvé pour cet utilisateur" });
        return;
    }
    res.json({ data: userArticles });
};
exports.getArticlesByUserId = getArticlesByUserId;
// READ: Récupérer un article par son ID
var getArticleById = function (req, res) {
    var id = parseInt(req.params.id);
    var article = article_model_1.articles.find(function (a) { return a.id === id; });
    if (!article) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }
    res.json({ data: article });
};
exports.getArticleById = getArticleById;
// UPDATE: Modifier un article par ID
var updateArticle = function (req, res) {
    var id = parseInt(req.params.id);
    var _a = req.body, titre = _a.titre, contenu = _a.contenu;
    var articleIndex = article_model_1.articles.findIndex(function (a) { return a.id === id; });
    if (articleIndex === -1) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }
    article_model_1.articles[articleIndex] = __assign(__assign({}, article_model_1.articles[articleIndex]), { titre: titre, contenu: contenu });
    res.json({ data: article_model_1.articles[articleIndex] });
};
exports.updateArticle = updateArticle;
// DELETE: Supprimer un article par ID
var deleteArticle = function (req, res) {
    var id = parseInt(req.params.id);
    var articleIndex = article_model_1.articles.findIndex(function (a) { return a.id === id; });
    if (articleIndex === -1) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }
    article_model_1.articles.splice(articleIndex, 1);
    res.status(204).send({ message: "Article supprimé avec succès" });
};
exports.deleteArticle = deleteArticle;
