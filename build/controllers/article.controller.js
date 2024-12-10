"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticlesByUserId = exports.getAllArticles = exports.createArticle = void 0;
const article_model_1 = require("../models/article.model");
const user_model_1 = require("../models/user.model");
// CREATE: Ajouter un nouvel article
const createArticle = (req, res) => {
    const { userId, titre, contenu } = req.body;
    if (!userId || !titre || !contenu) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }
    const userExists = user_model_1.users.some((user) => user.id === userId);
    if (!userExists) {
        res.status(404).json({ error: "Utilisateur n'existe pas" });
        return;
    }
    const newArticle = {
        id: article_model_1.articles.length + 1,
        userId,
        titre,
        contenu,
    };
    article_model_1.articles.push(newArticle);
    res.status(201).json({ message: "Article créer avec succès !", data: newArticle });
};
exports.createArticle = createArticle;
// READ: Récupérer tous les articles
const getAllArticles = (req, res) => {
    res.json(article_model_1.articles);
};
exports.getAllArticles = getAllArticles;
// READ: Récupérer les articles d'un utilisateur
const getArticlesByUserId = (req, res) => {
    const userId = parseInt(req.params.userId);
    const userArticles = article_model_1.articles.filter((article) => article.userId === userId);
    if (userArticles.length === 0) {
        res.status(404).json({ error: "Aucun article trouvé pour cet utilisateur" });
        return;
    }
    res.json({ data: userArticles });
};
exports.getArticlesByUserId = getArticlesByUserId;
// READ: Récupérer un article par son ID
const getArticleById = (req, res) => {
    const id = parseInt(req.params.id);
    const article = article_model_1.articles.find((a) => a.id === id);
    if (!article) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }
    res.json({ data: article });
};
exports.getArticleById = getArticleById;
// UPDATE: Modifier un article par ID
const updateArticle = (req, res) => {
    const id = parseInt(req.params.id);
    const { titre, contenu } = req.body;
    const articleIndex = article_model_1.articles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }
    article_model_1.articles[articleIndex] = Object.assign(Object.assign({}, article_model_1.articles[articleIndex]), { titre, contenu });
    res.json({ data: article_model_1.articles[articleIndex] });
};
exports.updateArticle = updateArticle;
// DELETE: Supprimer un article par ID
const deleteArticle = (req, res) => {
    const id = parseInt(req.params.id);
    const articleIndex = article_model_1.articles.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }
    article_model_1.articles.splice(articleIndex, 1);
    res.status(204).send({ message: "Article supprimé avec succès" });
};
exports.deleteArticle = deleteArticle;
