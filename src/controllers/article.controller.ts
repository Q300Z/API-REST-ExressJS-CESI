import { Request, Response } from 'express';
import { articles, Article } from '../models/article.model';
import {User, users} from '../models/user.model';

// CREATE: Ajouter un nouvel article
export const createArticle = (req: Request, res: Response): void => {
    const { userId, titre, contenu } = req.body;

    if (!userId || !titre || !contenu) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }

    const userExists = users.some((user: User) => user.id === userId);
    if (!userExists) {
        res.status(404).json({ error: "Utilisateur n'existe pas" });
        return;
    }

    const newArticle: Article = {
        id: articles.length + 1,
        userId,
        titre,
        contenu,
    };

    articles.push(newArticle);
    res.status(201).json({message:"Article créer avec succès !",data:newArticle});
};

// READ: Récupérer tous les articles
export const getAllArticles = (req: Request, res: Response): void => {
    res.json(articles);
};

// READ: Récupérer les articles d'un utilisateur
export const getArticlesByUserId = (req: Request, res: Response): void => {
    const userId = parseInt(req.params.userId);
    const userArticles = articles.filter((article: Article) => article.userId === userId);

    if (userArticles.length === 0) {
        res.status(404).json({ error: "Aucun article trouvé pour cet utilisateur" });
        return;
    }

    res.json({data:userArticles});
};

// READ: Récupérer un article par son ID
export const getArticleById = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id);
    const article = articles.find((a:Article) => a.id === id);

    if (!article) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }

    res.json({data:article});
};

// UPDATE: Modifier un article par ID
export const updateArticle = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id);
    const { titre, contenu } = req.body;

    const articleIndex = articles.findIndex((a: Article) => a.id === id);
    if (articleIndex === -1) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }

    articles[articleIndex] = { ...articles[articleIndex], titre, contenu };
    res.json({data:articles[articleIndex]});
};

// DELETE: Supprimer un article par ID
export const deleteArticle = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id);

    const articleIndex = articles.findIndex((a: Article) => a.id === id);
    if (articleIndex === -1) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
    }

    articles.splice(articleIndex, 1);
    res.status(204).send({message:"Article supprimé avec succès"});
};
