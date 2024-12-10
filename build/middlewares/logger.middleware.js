"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (req, res, next) => {
    const startTime = Date.now(); // Début du chronométrage
    const { method, originalUrl } = req;
    // Écoute l'événement de fin de réponse pour logger le statut et la durée
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const { statusCode } = res;
        // Formatage du log
        console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} (${duration}ms)`);
    });
    next();
};
exports.logger = logger;
