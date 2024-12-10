"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
var user_model_1 = require("../models/user.model");
// READ: Récupérer tous les utilisateurs
var getAllUsers = function (req, res) {
    res.json(user_model_1.users);
};
exports.getAllUsers = getAllUsers;
// READ: Récupérer un utilisateur par ID
var getUserById = function (req, res) {
    var id = parseInt(req.params.id);
    var user = user_model_1.users.find(function (u) { return u.id === id; });
    if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    res.json(user);
};
exports.getUserById = getUserById;
// UPDATE: Modifier un utilisateur par ID
var updateUser = function (req, res) {
    var id = parseInt(req.params.id);
    var _a = req.body, nom = _a.nom, prenom = _a.prenom, password = _a.password;
    var userIndex = user_model_1.users.findIndex(function (u) { return u.id === id; });
    if (userIndex === -1) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    user_model_1.users[userIndex] = __assign(__assign({}, user_model_1.users[userIndex]), { nom: nom, prenom: prenom, password: password });
    res.json(user_model_1.users[userIndex]);
};
exports.updateUser = updateUser;
// DELETE: Supprimer un utilisateur par ID
var deleteUser = function (req, res) {
    var id = parseInt(req.params.id);
    var userIndex = user_model_1.users.findIndex(function (u) { return u.id === id; });
    if (userIndex === -1) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    user_model_1.users.splice(userIndex, 1);
    res.status(204).send();
};
exports.deleteUser = deleteUser;
