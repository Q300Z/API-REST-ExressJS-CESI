import {Router} from 'express';
import {deleteUser, getAllUsers, getUserById, updateUser,} from '../controllers/user.controller';
import {register} from "../controllers/auth.controller";
import {isAdmin} from "../middlewares/auth.middleware";

const router = Router();

// Routes utilisateur
router.post('/users', isAdmin, register);         // CREATE
router.get('/users', isAdmin, getAllUsers);         // READ ALL
router.get('/users/:id', isAdmin, getUserById);     // READ ONE
router.put('/users/:id', isAdmin, updateUser);      // UPDATE
router.delete('/users/:id', isAdmin, deleteUser);   // DELETE

export default router;
