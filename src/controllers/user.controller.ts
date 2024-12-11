import {Request, Response} from 'express';
import prisma from '../utils/prisma';


// READ: Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
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
    const {lastname, firstname, password} = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {lastname, firstname, password},
        });
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
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Utilisateur non trouvé'});
        } else {
            res.status(500).json({error: 'Erreur lors de la suppression de l\'utilisateur', details: error.message});
        }
    }
};
