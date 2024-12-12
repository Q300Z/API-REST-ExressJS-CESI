# Étape 1 : Construction de l'image
FROM node:18-alpine AS builder

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances, y compris celles de développement
RUN npm install

# Copier tout le code source dans le conteneur
COPY . .

# Compiler l'application TypeScript
RUN npx tsc

# Étape 2 : Production
FROM node:18-alpine AS production

# Créer et définir le répertoire de travail pour l'exécution
WORKDIR /app

RUN apk add --no-cache openssl

# Copier les dépendances installées et le code compilé depuis l'étape de construction
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build .
COPY --from=builder /app/prisma .
COPY --from=builder /app/.env .
COPY --from=builder /app/src/swagger.yaml .

# Installer uniquement les dépendances de production
RUN npm install --omit=dev && npm cache clean --force

# Genere la base de données prisma
# Copier le script entrypoint.sh
COPY entrypoint.sh /app/

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application en mode production
CMD ["./entrypoint.sh", "node", "index.js"]
