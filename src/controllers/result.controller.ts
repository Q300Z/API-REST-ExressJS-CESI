import {Request, Response} from 'express';
import prisma from '../utils/prisma';
import redis from "../utils/redis";

const CACHE_EXPIRE = Number.parseInt(String(process.env.CACHE_EXPIRE || 3600));

export const createResult = async (req: Request, res: Response): Promise<void> => {
    const {eventId, userId, score, position, description} = req.body;

    if (!eventId || !userId) {
        res.status(400).json({error: 'Les champs eventId et userId sont obligatoires.'});
        return;
    }

    try {
        const result = await prisma.result.create({
            data: {
                eventId,
                userId,
                score,
                position,
                description,
            },
        });

        const cacheKey = 'results_' + eventId;
        await redis.del(cacheKey);

        res.status(201).json({message: 'Résultat ajouté avec succès.', data: result});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de l'ajout du résultat.", details: error.message});
    }
};

export const getResultsByEvent = async (req: Request, res: Response): Promise<void> => {
    const {eventId} = req.params;

    try {
        const cacheKey = 'results_' + eventId;
        const cachedEvents = await redis.get(cacheKey);

        if (cachedEvents) {
            res.json(JSON.parse(cachedEvents));
            return;
        }


        const results = await prisma.result.findMany({
            where: {eventId},
            include: {user: true}, // Inclure les infos utilisateur
        });

        await redis.set(cacheKey, JSON.stringify(results), 'EX', CACHE_EXPIRE); // Cache pour 1h

        res.status(200).json({data: results});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de la récupération des résultats.", details: error.message});
    }
};


export const updateResult = async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    const {score, position, description} = req.body;

    try {
        const updatedResult = await prisma.result.update({
            where: {id},
            data: {score, position, description},
        });
        const cacheKey = 'results_' + id;
        await redis.del(cacheKey);

        res.status(200).json({message: 'Résultat mis à jour avec succès.', data: updatedResult});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de la mise à jour du résultat.", details: error.message});
    }
};
