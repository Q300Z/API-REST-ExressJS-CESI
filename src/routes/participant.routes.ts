import {Router} from 'express';
import {getParticipantsByEvent, registerForEvent, unregisterFromEvent} from "../controllers/participant.controller";


const router = Router();

// Routes des participants
router.post('/events/:eventId/register', registerForEvent);     // Inscription à un événement
router.get('/events/:eventId/participants', getParticipantsByEvent); // Liste des participants par événement
router.post('/events/:eventId/unregister', unregisterFromEvent); // Désinscription d'un événement


export default router;
