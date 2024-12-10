"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var bcryptjs_1 = require("bcryptjs");
var user_model_1 = require("../models/user.model");
var SECRET_KEY = 'your_secret_key'; // Utilise une clé plus sécurisée dans une configuration pour la production
// Inscription
var register = function (req, res) {
    var _a = req.body, nom = _a.nom, prenom = _a.prenom, password = _a.password;
    if (!nom || !prenom || !password) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }
    var user = user_model_1.users.find(function (u) { return u.nom === nom; });
    if (user) {
        res.status(401).json({ error: 'Utilisateur déjà existant' });
        return;
    }
    var hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    var newUser = {
        id: user_model_1.users.length + 1,
        nom: nom,
        prenom: prenom,
        password: hashedPassword,
    };
    user_model_1.users.push(newUser);
    res.status(201).json({ message: 'Utilisateur créé', data: newUser });
};
exports.register = register;
// Connexion
var login = function (req, res) {
    var _a = req.body, nom = _a.nom, password = _a.password;
    var user = user_model_1.users.find(function (u) { return u.nom === nom; });
    if (!user) {
        res.status(401).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    var passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!passwordIsValid) {
        res.status(401).json({ error: 'Mot de passe incorrect' });
        return;
    }
    var token = jsonwebtoken_1.default.sign({ id: user.id, nom: user.nom }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Connection réussie !", data: { token: token, user: user } });
};
exports.login = login;
