import {NextFunction, Request, Response} from "express";

export const logger = (req: Request, res: Response, next: NextFunction) :void=> {
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
}