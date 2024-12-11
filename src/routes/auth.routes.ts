import {Router} from 'express';
import {login, register} from '../controllers/auth.controller';

const router = Router();

// Route d'inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

export default router;
