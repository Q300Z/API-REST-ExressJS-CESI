import Redis from 'ioredis';

// Créez une instance de Redis
const redis = new Redis({
    host: process.env.CACHE_HOSTNAME ||'localhost',  // URL de votre serveur Redis, par défaut localhost
    port: Number.parseInt(String(process.env.CACHE_PORT || 6379)) ,         // Port de Redis
    password: process.env.CACHE_PASSWORD ||'',  // Si vous avez un mot de passe
    db: Number.parseInt(String(process.env.CACHE_DB_NAME ||0)) ,              // Base de données Redis à utiliser
});

export default redis;
