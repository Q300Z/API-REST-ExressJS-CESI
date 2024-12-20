import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import redis from "../utils/redis";

const SECRET_KEY = process.env.SECRET_KEY || 'defaultsKey';
const SECRET_KEY_SALT = Number.parseInt(String(process.env.SECRET_KEY_SALT || 10));
const INIT = process.env.INIT || false;

// Inscription
export const register = async (req: Request, res: Response): Promise<void> => {
    const {lastname, firstname, email, password, dateOfBirth} = req.body;
    if (!lastname || !firstname || !email || !password || !dateOfBirth) {
        res.status(400).json({error: 'Tous les champs (lastname, firstname, email, password, dateOfBirth) sont requis.'});
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            res.status(409).json({error: 'Un utilisateur avec cet email existe déjà.'});
            return;
        }
        let role = 'USER';


        if (String(INIT).toLowerCase() === 'true') {
            // Création d'un utilisateur admin
            // Vérifier si l'utilisateur est le premier à s'inscrire
            const users = await prisma.user.findMany();
            if (users.length > 0) {
                res.status(403).json({error: 'L\'initialisation a déjà été effectuée.'});
                return;
            } else {
                role = 'ADMIN';
            }
        }


        const hashedPassword = await bcrypt.hash(password, SECRET_KEY_SALT);

        const newUser = await prisma.user.create({
            data: {
                lastname,
                firstname,
                email,
                dateOfBirth,
                role,
                password: hashedPassword,
            },
        });
        await redis.del('users_list');
        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            data: {id: newUser.id, email: newUser.email, password}
        });
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de l'inscription.", details: error.message});
    }
};

// Connexion
export const login = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400).json({error: 'Email et mot de passe sont requis.'});
        return;
    }

    try {
        const user = await prisma.user.findUnique({where: {email}});

        if (!user) {
            res.status(401).json({error: 'Utilisateur non trouvé.'});
            return;
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            res.status(401).json({error: 'Mot de passe incorrect.'});
            return;
        }

        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            SECRET_KEY,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            message: 'Connexion réussie.',
            data: {
                token,
                user: {
                    id: user.id,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    email: user.email,
                    role: user.role,
                    dateOfBirth: user.dateOfBirth
                },
            },
        });
    } catch (error: any) {
        res.status(500).json({error: "Erreur lors de la connexion.", details: error.message});
    }
};
