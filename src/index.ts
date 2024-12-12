import express, {Request, Response} from 'express';
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import authRoutes from "./routes/auth.routes";
import participantRoutes from "./routes/participant.routes";
import {logger} from "./middlewares/logger.middleware";
import {authenticateJWT} from "./middlewares/auth.middleware";
import prisma from "./utils/prisma";
import helmet from "helmet";
import {rateLimit} from 'express-rate-limit';

async function main() {
    const app = express();
    const port = 3000;

// Middleware pour parser les requêtes JSON
    app.use(express.json());
    app.use(helmet())

    // Configurez un rate limiter pour limiter les requêtes sur une période donnée
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 heure (en millisecondes)
        limit: 100, // Limite à 100 requêtes par IP dans la fenêtre
        message: 'Trop de requêtes de votre part, veuillez réessayer après 1 heure.',
        standardHeaders: true, // Pour inclure des informations sur le limiteur dans les en-têtes
    });

// Appliquer le rate limiter à toutes les requêtes
    app.use(limiter);


    //app.use(authenticateJWT)
    app.use(logger);

// Route de base
    app.get('/', (req: Request, res: Response) => {
        res.send('Hello, TypeScript with Express!');
    });

    app.use('/api', userRoutes);
    app.use('/api', eventRoutes);
    app.use('/api',participantRoutes);
    app.use('/auth', authRoutes);


// Lancer le serveur
    app.listen(port, () => {
        console.log(`Serveur démarré sur http://localhost:${port}`);
    });

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });