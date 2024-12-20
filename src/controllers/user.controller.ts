import {Request, Response} from 'express';
import prisma from '../utils/prisma';
import redis from "../utils/redis";


const CACHE_EXPIRE = Number.parseInt(String(process.env.CACHE_EXPIRE || 3600));

// READ: Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const cacheKey = 'users_list';
        const cachedEvents = await redis.get(cacheKey);

        if (cachedEvents) {
            res.json(JSON.parse(cachedEvents));
            return;
        }
        const users = await prisma.user.findMany();

        await redis.set(cacheKey, JSON.stringify(users), 'EX', CACHE_EXPIRE); // Cache pour 1h

        res.json(users);
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la récupération des utilisateurs', details: error.message});
    }
};

// READ: Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {id}
        });
        if (!user) {
            res.status(404).json({error: 'Utilisateur non trouvé'});
            return;
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({error: 'Erreur lors de la récupération de l\'utilisateur', details: error.message});
    }
};

// UPDATE: Modifier un utilisateur
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const {lastname, firstname, password, role} = req.body;

    try {
        if (role !== 'admin' && role !== 'user') {
            res.status(400).json({error: 'Le rôle doit être `admin` ou `user`'});
        }

        const updatedUser = await prisma.user.update({
            where: {id},
            data: {lastname, firstname, password, role},
        });
        await redis.del('users_list');

        res.json({message: 'Utilisateur mis à jour avec succès', data: updatedUser});
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Utilisateur non trouvé'});
        } else {
            res.status(500).json({error: 'Erreur lors de la mise à jour de l\'utilisateur', details: error.message});
        }
    }
};

// DELETE: Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        await prisma.user.delete({
            where: {id},
        });
        await redis.del('users_list');
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Utilisateur non trouvé'});
        } else {
            res.status(500).json({error: 'Erreur lors de la suppression de l\'utilisateur', details: error.message});
        }
    }
};
