"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const SECRET_KEY = 'your_secret_key'; // Utilise une clé plus sécurisée dans une configuration pour la production
// Inscription
const register = (req, res) => {
    const { nom, prenom, password } = req.body;
    if (!nom || !prenom || !password) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }
    const user = user_model_1.users.find((u) => u.nom === nom);
    if (user) {
        res.status(401).json({ error: 'Utilisateur déjà existant' });
        return;
    }
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    const newUser = {
        id: user_model_1.users.length + 1,
        nom,
        prenom,
        password: hashedPassword,
    };
    user_model_1.users.push(newUser);
    res.status(201).json({ message: 'Utilisateur créé', data: newUser });
};
exports.register = register;
// Connexion
const login = (req, res) => {
    const { nom, password } = req.body;
    const user = user_model_1.users.find((u) => u.nom === nom);
    if (!user) {
        res.status(401).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    const passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!passwordIsValid) {
        res.status(401).json({ error: 'Mot de passe incorrect' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, nom: user.nom }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Connection réussie !", data: { token: token, user: user } });
};
exports.login = login;
