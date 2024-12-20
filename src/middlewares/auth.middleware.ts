import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'defaultsKey'; // Remplace par une clé secrète sécurisée pour la production

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    // Exclure les routes qui ne nécessitent pas d'authentification
    const openRoutes = ['/auth/login', '/auth/register'];
    if (openRoutes.includes(req.path)) {
        next();
        return;
    }

    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        res.status(401).json({error: 'Authorization header manquant ou mal formé.'});
        return;
    }

    const token = tokenHeader.split(' ')[1]; // Extraire le token après "Bearer"

    try {
        (req as any).user = jwt.verify(token as string, SECRET_KEY); // Attache les infos de l'utilisateur au request
        next();
    } catch (error) {
        res.status(403).json({error: 'Token invalide'});
        return;
    }
};


export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const role = (req as any).user.role;
    if (role !== 'ADMIN') {
        res.status(403).json({error: 'Accès interdit'});
        return;
    }
    next()
}