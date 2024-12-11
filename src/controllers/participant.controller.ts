import {Request, Response} from 'express';
import prisma from '../utils/prisma';
import redis from '../utils/redis';

export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
    const {eventId} = req.params;
    const userId = (req as any).user.id;

    if (!eventId || !userId) {
        res.status(400).json({error: 'L\'ID de l\'événement et l\'ID de l\'utilisateur sont requis.'});
        return;
    }

    try {
        // Vérifier si l'événement existe
        const event = await prisma.event.findUnique({where: {id: eventId}});
        if (!event) {
            res.status(404).json({error: 'Événement non trouvé.'});
            return;
        }

        // Vérifier si l'utilisateur est déjà inscrit
        const existingRegistration = await prisma.eventParticipant.findFirst({
            where: {
                eventId,
                userId,
            },
        });

        if (existingRegistration) {
            res.status(409).json({error: 'Utilisateur déjà inscrit à cet événement.'});
            return;
        }

        // Créer l'inscription
        const newRegistration = await prisma.eventParticipant.create({
            data: {
                eventId,
                userId,
            },
        });

        // Invalider le cache des participants de l'événement
        const participantsCacheKey = `event_${eventId}_participants`;
        await redis.del(participantsCacheKey); // Invalider le cache

        res.status(201).json({message: 'Inscription réussie.', data: newRegistration});
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de l\'inscription à l\'événement.', details: error.message});
    }
};

export const getParticipantsByEvent = async (req: Request, res: Response): Promise<void> => {
    const {eventId} = req.params;

    try {
        // Vérifier si les participants sont en cache
        const participantsCacheKey = `event_${eventId}_participants`;
        const cachedParticipants = await redis.get(participantsCacheKey);

        let participants = []

        if (cachedParticipants) {
            participants = JSON.parse(cachedParticipants) // Retourner les données en cache

        } else {
            // Récupérer les participants depuis la base de données
            participants = await prisma.eventParticipant.findMany({
                where: {eventId},
                include: {
                    user: true, // Inclure les détails de l'utilisateur
                },
            });

            if (participants.length === 0) {
                res.status(404).json({error: 'Aucun participant trouvé pour cet événement.'});
                return;
            }

            // Mettre en cache les participants avec une expiration de 1 heure
            await redis.set(participantsCacheKey, JSON.stringify({
                data: participants,
                metadata: {participantCount: participants.length},
            }), 'EX', 3600);
        }

        const result = {
            data: participants,
            metadata: {participantCount: participants.length},
        };

        res.json(result);
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la récupération des participants.', details: error.message});
    }
};

export const unregisterFromEvent = async (req: Request, res: Response): Promise<void> => {
    const {eventId} = req.params;
    const userId = (req as any).user.id;

    try {

        // Vérifier si l'événement existe
        const event = await prisma.event.findUnique({where: {id: eventId}});
        if (!event) {
            res.status(404).json({error: 'Événement non trouvé.'});
            return;
        }

        // Vérifier si l'utilisateur est inscrit à cet événement
        const registration = await prisma.eventParticipant.findFirst({
            where: {
                eventId,
                userId,
            },
        });

        if (!registration) {
            res.status(404).json({error: 'L\'utilisateur n\'est pas inscrit à cet événement.'});
            return;
        }

        // Supprimer l'inscription
        await prisma.eventParticipant.delete({
            where: {
                id: registration.id,
            },
        });

        // Invalider le cache des participants de l'événement
        const participantsCacheKey = `event_${eventId}_participants`;
        await redis.del(participantsCacheKey); // Invalider le cache

        res.status(200).json({message: 'Désinscription réussie.'});
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la désinscription de l\'événement.', details: error.message});
    }
};
