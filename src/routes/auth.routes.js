"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var router = (0, express_1.Router)();
// Route d'inscription
router.post('/register', auth_controller_1.register);
// Route de connexion
router.post('/login', auth_controller_1.login);
exports.default = router;
