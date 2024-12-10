import { Router } from 'express';
import {
    createArticle,
    getAllArticles,
    getArticlesByUserId,
    getArticleById,
    updateArticle,
    deleteArticle,
} from '../controllers/article.controller';

const router = Router();

// Routes des articles
router.post('/articles', createArticle);                // CREATE
router.get('/articles', getAllArticles);               // READ ALL
router.get('/users/:userId/articles', getArticlesByUserId); // READ by User
router.get('/articles/:id', getArticleById);           // READ ONE
router.put('/articles/:id', updateArticle);            // UPDATE
router.delete('/articles/:id', deleteArticle);         // DELETE

export default router;
