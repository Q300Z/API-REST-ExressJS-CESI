import express, { Request, Response } from 'express';
import userRoutes from "./routes/user.routes";
import articleRoutes from "./routes/article.routes";
import authRoutes from "./routes/auth.routes";
import {logger} from "./middlewares/logger.middleware";
import {authenticateJWT} from "./middlewares/auth.middleware";

const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(logger);
app.use(authenticateJWT)
// Route de base
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.use('/api', userRoutes);
app.use('/api', articleRoutes);
app.use('/auth', authRoutes);


// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
