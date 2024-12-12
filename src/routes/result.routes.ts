import { Router } from 'express';
import {createResult, getResultsByEvent, updateResult} from "../controllers/result.controller";
import {isAdmin} from "../middlewares/auth.middleware";

const router = Router();

// Routes pour les résultats
router.post('/results', isAdmin,createResult); // Ajouter un résultat
router.get('/events/:eventId/results', getResultsByEvent); // Lister les résultats par événement
router.put('/results/:id',isAdmin, updateResult); // Mettre à jour un résultat

export default router;
