import { Request, Response } from 'express';
import { users, User } from '../models/user.model';

// READ: Récupérer tous les utilisateurs
export const getAllUsers = (req: Request, res: Response): void => {
    res.json(users);
};

// READ: Récupérer un utilisateur par ID
export const getUserById = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    res.json({data:user});
};

// UPDATE: Modifier un utilisateur par ID
export const updateUser = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id);
    const { nom, prenom } = req.body;

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    users[userIndex] = { ...users[userIndex], nom, prenom };
    res.json({data:users[userIndex]});
};

// DELETE: Supprimer un utilisateur par ID
export const deleteUser = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id);

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    users.splice(userIndex, 1);
    res.status(204).send({message:"Utilisateur supprimé avec succès"});
};
