import {Request, Response} from 'express';
import prisma from '../utils/prisma';
import redis from '../utils/redis';

// Gestion des événements sportifs

// 1. Création d'un événement
export const createEvent = async (req: Request, res: Response): Promise<void> => {
    const {name, sport, date, location, description} = req.body;
    const file = (req as any).file;

    if (!name || !sport || !date || !location) {
        res.status(400).json({error: 'Les champs name, sport, date et location sont obligatoires.'});
        return;
    }

    try {
        const newEvent = await prisma.event.create({
            data: {name, sport, date, location, description,userId:(req as any).user.id,image: file ? file : null},
        });

        await redis.del('events_list'); // Invalider le cache des événements

        res.status(201).json({message: 'Événement créé avec succès.', data: newEvent});
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la création de l\'événement.', details: error.message});
    }
};

// 2. Liste des événements
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const cacheKey = 'events_list';
        const cachedEvents = await redis.get(cacheKey);

        if (cachedEvents) {
            res.json(JSON.parse(cachedEvents));
            return;
        }

        const events = await prisma.event.findMany();

        await redis.set(cacheKey, JSON.stringify(events), 'EX', 3600); // Cache pour 1h

        res.json(events);
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la récupération des événements.', details: error.message});
    }
};

// 3. Détail d'un événement
export const getEventById = async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    try {
        const event = await prisma.event.findUnique({where: {id}});

        if (!event) {
            res.status(404).json({error: 'Événement non trouvé.'});
            return;
        }

        res.json(event);
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la récupération de l\'événement.', details: error.message});
    }
};

// 4. Modification d'un événement
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    const {name, sport, date, location, description} = req.body;

    try {
        const updatedEvent = await prisma.event.update({
            where: {id},
            data: {name, sport, date, location, description},
        });

        await redis.del('events_list'); // Invalider le cache des événements

        res.json({message: 'Événement mis à jour avec succès.', data: updatedEvent});
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Événement non trouvé.'});
        } else {
            res.status(500).json({error: 'Erreur lors de la mise à jour de l\'événement.', details: error.message});
        }
    }
};

// 5. Suppression d'un événement
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;

    try {
        await prisma.event.delete({where: {id}});

        await redis.del('events_list'); // Invalider le cache des événements

        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Événement non trouvé.'});
        } else {
            res.status(500).json({error: 'Erreur lors de la suppression de l\'événement.', details: error.message});
        }
    }
};

// Gestion des participants

// 1. Inscription à un événement
export const registerParticipant = async (req: Request, res: Response): Promise<void> => {
    const {eventId, userId} = req.body;

    if (!eventId || !userId) {
        res.status(400).json({error: 'Les champs eventId et userId sont obligatoires.'});
        return;
    }

    try {
        const registration = await prisma.eventParticipant.create({
            data: {
                eventId,
                userId,
                registrationDate: new Date(),
                status: 'REGISTERED',
            },
        });

        await redis.del(`event_${eventId}_participants`); // Invalider le cache des participants de l'événement

        res.status(201).json({message: 'Participant inscrit avec succès.', data: registration});
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de l\'inscription du participant.', details: error.message});
    }
};

// 2. Liste des participants par événement
export const getEventParticipants = async (req: Request, res: Response): Promise<void> => {
    const {eventId} = req.params;

    try {
        const cacheKey = `event_${eventId}_participants`;
        const cachedParticipants = await redis.get(cacheKey);

        if (cachedParticipants) {
            res.json(JSON.parse(cachedParticipants));
            return;
        }

        const participants = await prisma.eventParticipant.findMany({
            where: {eventId},
            include: {user: true},
        });

        await redis.set(cacheKey, JSON.stringify(participants), 'EX', 3600); // Cache pour 1h

        res.json(participants);
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la récupération des participants.', details: error.message});
    }
};

// 3. Désinscription d'un événement
export const cancelRegistration = async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;

    try {
        const cancelledRegistration = await prisma.eventParticipant.update({
            where: {id},
            data: {status: 'CANCELLED'},
        });

        await redis.del(`event_${cancelledRegistration.eventId}_participants`); // Invalider le cache des participants de l'événement

        res.json({message: 'Inscription annulée avec succès.', data: cancelledRegistration});
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Inscription non trouvée.'});
        } else {
            res.status(500).json({error: 'Erreur lors de l\'annulation de l\'inscription.', details: error.message});
        }
    }
};
