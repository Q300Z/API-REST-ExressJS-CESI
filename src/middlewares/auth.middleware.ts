import e, {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Remplace par une clé secrète sécurisée pour la production

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    // exclure les routes qui ne nécessitent pas d'authentification
    if (req.path === '/auth/login' || req.path === '/auth/register') {
        next();
        return;
    }
    const token = req.headers['authorization'];

    if (!token) {
        res.status(401).json({error: 'Token manquant'});
        return;
    }

    try {
        (req as any).user = jwt.verify(token as string, SECRET_KEY); // Attache les infos de l'utilisateur au request
        next();
    } catch (error) {
        res.status(403).json({error: 'Token invalide'});
        return;
    }
};
