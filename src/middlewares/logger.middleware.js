"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var logger = function (req, res, next) {
    var startTime = Date.now(); // Début du chronométrage
    var method = req.method, originalUrl = req.originalUrl;
    // Écoute l'événement de fin de réponse pour logger le statut et la durée
    res.on('finish', function () {
        var endTime = Date.now();
        var duration = endTime - startTime;
        var statusCode = res.statusCode;
        // Formatage du log
        console.log("[".concat(new Date().toISOString(), "] ").concat(method, " ").concat(originalUrl, " - ").concat(statusCode, " (").concat(duration, "ms)"));
    });
    next();
};
exports.logger = logger;
