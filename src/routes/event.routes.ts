import {Router} from 'express';
import {createEvent, deleteEvent, getAllEvents, getEventById, updateEvent,} from '../controllers/event.controller';
import {uploadSingleFile} from "../middlewares/multer.middleware";
import {isAdmin} from "../middlewares/auth.middleware";

const router = Router();

// Routes des events
router.post('/events', isAdmin, uploadSingleFile, createEvent);                // CREATE
router.get('/events', getAllEvents);               // READ ALL
router.get('/events/:id', getEventById);           // READ ONE
router.put('/events/:id', isAdmin, updateEvent);            // UPDATE
router.delete('/events/:id', isAdmin, deleteEvent);         // DELETE

export default router;
