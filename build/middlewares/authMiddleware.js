"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = 'your_secret_key'; // Remplace par une clé secrète sécurisée pour la production
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded; // Attache les infos de l'utilisateur au request
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};
exports.authenticateJWT = authenticateJWT;
