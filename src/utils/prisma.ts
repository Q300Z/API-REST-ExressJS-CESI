import {PrismaClient} from '@prisma/client';

// Crée une instance unique de PrismaClient pour être réutilisée
const prisma = new PrismaClient();

export default prisma;
