"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var article_controller_1 = require("../controllers/article.controller");
var router = (0, express_1.Router)();
// Routes des articles
router.post('/articles', article_controller_1.createArticle); // CREATE
router.get('/articles', article_controller_1.getAllArticles); // READ ALL
router.get('/users/:userId/articles', article_controller_1.getArticlesByUserId); // READ by User
router.get('/articles/:id', article_controller_1.getArticleById); // READ ONE
router.put('/articles/:id', article_controller_1.updateArticle); // UPDATE
router.delete('/articles/:id', article_controller_1.deleteArticle); // DELETE
exports.default = router;
