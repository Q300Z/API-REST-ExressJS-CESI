import Redis from 'ioredis';

// Créez une instance de Redis
const redis = new Redis({
    host: 'localhost',  // URL de votre serveur Redis, par défaut localhost
    port: 6379,         // Port de Redis
    password: '',  // Si vous avez un mot de passe
    db: 0,              // Base de données Redis à utiliser
});

export default redis;
