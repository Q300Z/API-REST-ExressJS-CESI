import multer, {DiskStorageOptions, FileFilterCallback, Options, StorageEngine} from 'multer';
import { Request } from 'express';

// Configuration du stockage
const storage: StorageEngine = multer.diskStorage({
    destination:  './uploads/',
    filename: (req:Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

// Filtrage des fichiers (par exemple, uniquement les images)
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers d\'image sont autorisés.'));
    }
};

// Configuration de Multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille (5 Mo)
    fileFilter,
});

// Middleware pour un seul fichier
export const uploadSingleFile = upload.single('image');

// Middleware pour plusieurs fichiers
export const uploadMultipleFiles = upload.array('images', 10); // Maximum 10 fichiers
