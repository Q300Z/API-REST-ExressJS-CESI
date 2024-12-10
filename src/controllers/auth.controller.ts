import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users, User } from '../models/user.model';

const SECRET_KEY = 'your_secret_key'; // Utilise une clé plus sécurisée dans une configuration pour la production

// Inscription
export const register = (req: Request, res: Response): void => {
    const { nom, prenom, password } = req.body;

    if (!nom || !prenom || !password) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }

    const user = users.find((u) => u.nom === nom);
    if (user) {
        res.status(401).json({ error: 'Utilisateur déjà existant' });
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser: User = {
        id: users.length + 1,
        nom,
        prenom,
        password: hashedPassword,
    };

    users.push(newUser);
    res.status(201).json({ message: 'Utilisateur créé',data: newUser });
};

// Connexion
export const login = (req: Request, res: Response): void => {
    const { nom, password } = req.body;

    const user = users.find((u) => u.nom === nom);
    if (!user) {
        res.status(401).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        res.status(401).json({ error: 'Mot de passe incorrect' });
        return;
    }

    const token = jwt.sign(
        { id: user.id, nom: user.nom },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.status(200).json({ message:"Connection réussie !",data: {token: token,user: user } });
};
