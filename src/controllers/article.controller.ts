import {Request, Response} from 'express';
import prisma from "../utils/prisma";
import redis from "../utils/redis";

// CREATE: Ajouter un nouvel article
export const createArticle = async (req: Request, res: Response): Promise<void> => {
    const {userId, titre, contenu} = req.body;

    if (!userId || !titre || !contenu) {
        res.status(400).json({error: 'Tous les champs sont requis'});
        return;
    }

    try {
        // Vérifier si l'utilisateur existe
        const userExists = await prisma.user.findUnique({where: {id: userId}});
        if (!userExists) {
            res.status(404).json({error: "Utilisateur n'existe pas"});
            return;
        }

        // Créer un nouvel article
        const newArticle = await prisma.article.create({
            data: {
                userId,
                titre,
                contenu,
            },
        });

        // Générer une clé Redis pour invalider les caches des articles
        // Invalider les articles de la page d'un utilisateur (si vous mettez en cache par utilisateur et page)
        const userArticlesCacheKey = `user_${userId}_articles_page_*`; // Utilisez un modèle pour affecter toutes les pages d'un utilisateur
        const allArticlesCacheKey = `articles_page_*`; // Pour invalider tous les articles en cache, si vous avez une page globale

        // Supprimer les clés en cache liées à ces articles
        await redis.del(userArticlesCacheKey); // Invalider les articles de cet utilisateur
        await redis.del(allArticlesCacheKey); // Invalider les articles globaux (optionnel, si nécessaire)

        res.status(201).json({message: "Article créé avec succès !", data: newArticle});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de la création de l'article", details: error.message});
    }
};

// READ: Récupérer tous les articles avec pagination
export const getAllArticles = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;  // Page courante (par défaut 1)
    const pageSize = parseInt(req.query.pageSize as string) || 100;  // Nombre d'articles par page (par défaut 10)

    try {
        // Clé Redis pour la pagination
        const cacheKey = `articles_page_${page}_size_${pageSize}`;

        // Vérifier si les données sont dans le cache Redis
        const cachedArticles = await redis.get(cacheKey);
        if (cachedArticles) {
            res.json(JSON.parse(cachedArticles)); // Retourner les données en cache
            return;
        }

        // Compter le nombre total d'articles
        const articleTotal = await prisma.article.count();

        // Calculer le nombre total de pages
        const pageTotal = Math.ceil(articleTotal / pageSize);

        // Vérifier si la page demandée existe
        if (page > pageTotal) {
            res.status(400).json({ error: `La page ${page} n'existe pas. Il y a seulement ${pageTotal} pages.` });
            return;
        }

        const articles = await prisma.article.findMany({
            include: { user: false },
            skip: (page - 1) * pageSize,  // Calculer l'index de départ
            take: pageSize,  // Limiter le nombre d'articles récupérés
        });

        // Vérification si des articles existent pour la page demandée
        if (articles.length === 0) {
            res.status(404).json({ error: 'Aucun article trouvé.' });
            return;
        }

        const result = { data: articles, metadata:{page, pageSize,pageTotal,articleTotal} }

        // Mettre en cache les articles de l'utilisateur dans Redis avec expiration de 1 heure
        await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: 'Erreur lors de la récupération des articles', details: error.message });
    }
};


// READ: Récupérer les articles d'un utilisateur avec pagination
export const getArticlesByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;  // Page courante (par défaut 1)
    const pageSize = parseInt(req.query.pageSize as string) || 100;  // Nombre d'articles par page (par défaut 10)

    try {


// Clé Redis pour la pagination des articles d'un utilisateur
        const cacheKey = `user_${userId}_articles_page_${page}_size_${pageSize}`;

        // Vérifier si les données sont dans le cache Redis
        const cachedUserArticles = await redis.get(cacheKey);
        if (cachedUserArticles) {
            res.json(JSON.parse(cachedUserArticles)); // Retourner les données en cache
            return;
        }

        // Compter le nombre total d'articles pour l'utilisateur
        const articleTotal = await prisma.article.count({
            where: { userId },
        });

        // Calculer le nombre total de pages
        const pageTotal = Math.ceil(articleTotal / pageSize);

        // Vérifier si la page demandée existe
        if (page > pageTotal) {
            res.status(400).json({ error: `La page ${page} n'existe pas pour cet utilisateur. Il y a seulement ${pageTotal} pages.` });
            return;
        }

        const userArticles = await prisma.article.findMany({
            where: { userId },
            include: { user: false },
            skip: (page - 1) * pageSize,  // Calculer l'index de départ
            take: pageSize,  // Limiter le nombre d'articles récupérés
        });

        if (userArticles.length === 0) {
            res.status(404).json({ error: 'Aucun article trouvé pour cet utilisateur' });
            return;
        }

        const result = { data: userArticles, metadata:{page, pageSize,pageTotal,articleTotal} }

        // Mettre en cache les articles de l'utilisateur dans Redis avec expiration de 1 heure
        await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: 'Erreur lors de la récupération des articles', details: error.message });
    }
};


// READ: Récupérer un article par son ID
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const article = await prisma.article.findUnique({
            where: {id},
            include: {user: true},
        });

        if (!article) {
            res.status(404).json({error: "Article non trouvé"});
            return;
        }

        res.json({data: article});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de la récupération de l'article", details: error.message});
    }
};

// UPDATE: Modifier un article par ID
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const {titre, contenu} = req.body;

    try {
        const article = await prisma.article.update({
            where: {id},
            data: {titre, contenu},
        });

        // Générer une clé Redis pour invalider les caches des articles
        // Invalider les articles de la page d'un utilisateur (si vous mettez en cache par utilisateur et page)
        const userArticlesCacheKey = `user_${(req as any).user.userId}_articles_page_*`; // Utilisez un modèle pour affecter toutes les pages d'un utilisateur
        const allArticlesCacheKey = `articles_page_*`; // Pour invalider tous les articles en cache, si vous avez une page globale

        // Supprimer les clés en cache liées à ces articles
        await redis.del(userArticlesCacheKey); // Invalider les articles de cet utilisateur
        await redis.del(allArticlesCacheKey); // Invalider les articles globaux (optionnel, si nécessaire)

        res.json({data: article});
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: "Article non trouvé"});
        } else {
            res.status(500).json({error: "Erreur lors de la mise à jour de l'article", details: error.message});
        }
    }
};

// DELETE: Supprimer un article par ID
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        await prisma.article.delete({
            where: {id},
        });

        // Générer une clé Redis pour invalider les caches des articles
        // Invalider les articles de la page d'un utilisateur (si vous mettez en cache par utilisateur et page)
        const userArticlesCacheKey = `user_${(req as any).user.userId}_articles_page_*`; // Utilisez un modèle pour affecter toutes les pages d'un utilisateur
        const allArticlesCacheKey = `articles_page_*`; // Pour invalider tous les articles en cache, si vous avez une page globale

        // Supprimer les clés en cache liées à ces articles
        await redis.del(userArticlesCacheKey); // Invalider les articles de cet utilisateur
        await redis.del(allArticlesCacheKey); // Invalider les articles globaux (optionnel, si nécessaire)

        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: "Article non trouvé"});
        } else {
            res.status(500).json({error: "Erreur lors de la suppression de l'article", details: error.message});
        }
    }
};
