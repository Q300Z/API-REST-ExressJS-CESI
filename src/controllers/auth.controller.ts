import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Utilise une clé plus sécurisée et stockée dans les variables d'environnement

// Inscription
export const register = async (req: Request, res: Response): Promise<void> => {
    const {nom, prenom, password} = req.body;

    if (!nom || !prenom || !password) {
        res.status(400).json({error: 'Tous les champs sont requis'});
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({where: {nom}});
        if (existingUser) {
            res.status(401).json({error: 'Utilisateur déjà existant'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                nom,
                prenom,
                password: hashedPassword,
            },
        });

        res.status(201).json({message: 'Utilisateur créé', data: newUser});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de l'inscription", details: error.message});
    }
};

// Connexion
export const login = async (req: Request, res: Response): Promise<void> => {
    const {nom, password} = req.body;

    if (!nom || !password) {
        res.status(400).json({error: 'Nom et mot de passe sont requis'});
        return;
    }

    try {
        const user = await prisma.user.findUnique({where: {nom}});

        if (!user) {
            res.status(401).json({error: 'Utilisateur non trouvé'});
            return;
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            res.status(401).json({error: 'Mot de passe incorrect'});
            return;
        }

        const token = jwt.sign(
            {id: user.id, nom: user.nom},
            SECRET_KEY,
            {expiresIn: '1h'}
        );

        res.status(200).json({message: "Connexion réussie !", data: {token, user}});
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de la connexion", details: error.message});
    }
};
