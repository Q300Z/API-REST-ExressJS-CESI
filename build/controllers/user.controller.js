"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = require("../models/user.model");
// READ: Récupérer tous les utilisateurs
const getAllUsers = (req, res) => {
    res.json(user_model_1.users);
};
exports.getAllUsers = getAllUsers;
// READ: Récupérer un utilisateur par ID
const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = user_model_1.users.find((u) => u.id === id);
    if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    res.json(user);
};
exports.getUserById = getUserById;
// UPDATE: Modifier un utilisateur par ID
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { nom, prenom, password } = req.body;
    const userIndex = user_model_1.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    user_model_1.users[userIndex] = Object.assign(Object.assign({}, user_model_1.users[userIndex]), { nom, prenom, password });
    res.json(user_model_1.users[userIndex]);
};
exports.updateUser = updateUser;
// DELETE: Supprimer un utilisateur par ID
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = user_model_1.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    user_model_1.users.splice(userIndex, 1);
    res.status(204).send();
};
exports.deleteUser = deleteUser;
