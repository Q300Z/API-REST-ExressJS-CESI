"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var auth_controller_1 = require("../controllers/auth.controller");
var router = (0, express_1.Router)();
// Routes utilisateur
router.post('/users', auth_controller_1.register); // CREATE
router.get('/users', user_controller_1.getAllUsers); // READ ALL
router.get('/users/:id', user_controller_1.getUserById); // READ ONE
router.put('/users/:id', user_controller_1.updateUser); // UPDATE
router.delete('/users/:id', user_controller_1.deleteUser); // DELETE
exports.default = router;
