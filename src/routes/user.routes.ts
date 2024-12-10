import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller';
import {register} from "../controllers/auth.controller";

const router = Router();

// Routes utilisateur
router.post('/users', register);         // CREATE
router.get('/users', getAllUsers);         // READ ALL
router.get('/users/:id', getUserById);     // READ ONE
router.put('/users/:id', updateUser);      // UPDATE
router.delete('/users/:id', deleteUser);   // DELETE

export default router;
