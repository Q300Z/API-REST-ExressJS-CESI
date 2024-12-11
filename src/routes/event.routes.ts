import {Router} from 'express';
import {createEvent, deleteEvent, getAllEvents, getEventById, updateEvent,} from '../controllers/event.controller';

const router = Router();

// Routes des events
router.post('/events', createEvent);                // CREATE
router.get('/events', getAllEvents);               // READ ALL
router.get('/events/:id', getEventById);           // READ ONE
router.put('/events/:id', updateEvent);            // UPDATE
router.delete('/events/:id', deleteEvent);         // DELETE

export default router;
