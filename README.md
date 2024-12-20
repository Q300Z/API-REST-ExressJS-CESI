# Initialisation du projet pour la Production
## 1. Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker-compose](https://docs.docker.com/compose/install/) installé sur votre machine
## 2. Initialisation du projet
### Configuration des l'environnements de variables
- Créer un fichier `.env` à la racine du projet
- Ajouter les variables d'environnements suivantes:
```shell
# .env
# Configuration de la base de données
POSTGRES_HOSTNAME=postgre
POSTGRES_PORT=5432
POSTGRES_USER=postgres # Utilisateur par défaut
POSTGRES_PASSWORD=password # Mot de passe par défaut
POSTGRES_DB=db

# URL pour Prisma
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Clé secrète pour les tokens
SECRET_KEY=SECRET_KEY
SECRET_KEY_SALT=10

# Configuration du cache
CACHE_EXPIRE=3600
CACHE_HOSTNAME=redis
CACHE_PORT=6379
CACHE_PASSWORD=
CACHE_DB_NAME=0

# Pour l'initialisation de l'api avec comme premier utilisateur un administrateur
INIT=true
```
## 3. Premier lancement
- Exécuter la commande suivante pour initialiser le projet :
```shell
docker-compose -f docker-compose.prod.yml up -d --build
```
- Créer votre première utilisateur en utilisant l'api `/api/auth/register` avec les informations suivantes:
```json
{
    "lastname" : "*VOTRE NOM*",
    "firstname" : "*VOTRE PRENOM*",
    "email" : "*VOTRE EMAIL*",
    "password" : "*VOTRE MOT DE PASSE*",
    "dateOfBirth" : "*VOTRE DATE DE NAISSANCE*"
}
```
- Eteignez le projet avec la commande suivante:
```shell
docker-compose -f docker-compose.prod.yml down
```
### Lancement de l'api
- Modifier la variable `INIT` dans le fichier `.env` à `false`
- Exécuter la commande suivante pour relancer le projet:
```shell
docker-compose -f docker-compose.prod.yml up -d
```
Vous pouvez maintenant accéder à l'api à l'adresse suivante: `http://localhost:3000`


# Initialisation du projet pour le développement
## 1. Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker-compose](https://docs.docker.com/compose/install/) installé sur votre machine
- [VS Code](https://code.visualstudio.com/) installé sur votre machine (Au choix)
- [JetBrains IDE](https://www.jetbrains.com/fr-fr/) installé sur votre machine (Au choix)

## 2. Initialisation du projet
### Configuration des l'environnements de variables
- Créer un fichier `.env` à la racine du projet
- Ajouter les variables d'environnements suivantes:
```shell
# .env
# Configuration de la base de données
POSTGRES_HOSTNAME=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres # Utilisateur par défaut
POSTGRES_PASSWORD=password # Mot de passe par défaut
POSTGRES_DB=db

# URL pour Prisma
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Clé secrète pour les tokens
SECRET_KEY=SECRET_KEY
SECRET_KEY_SALT=10

# Configuration du cache
CACHE_EXPIRE=3600
CACHE_HOSTNAME=localhost
CACHE_PORT=6379
CACHE_PASSWORD=
CACHE_DB_NAME=0

# Pour l'initialisation de l'api avec comme premier utilisateur un administrateur
INIT=true
```
## 3. Premier lancement
### Démarrage du projet avec votre IDE
#### Avec VS Code
- Ouvrer votre IDE
- Si vous êtes sur VS Code, ouvrir le projet avec la commande suivante:
```shell
code .
```
- Puis faite `CTRL` + `MAJ` + `P` pour ouvrir la palette de commande
- Taper `Remote-Containers: Reopen in Container` et appuyer sur `Entrée`
- Sélectionner le fichier `.devcontainer/devcontainer.json` pour ouvrir le projet dans un conteneur
#### Avec JetBrains IDE
- Ouvrer votre IDE
- Si un projet est déjà ouvert, fermer le projet
- Puis acceder à `Remote Development` > `Dev Container` dans la fenêtre de démarrage de l'IDE
- Cliquer sur `New Dev Container`
- Sélectionner le `.devcontainer/devcontainer.json` du dossier du projet
### Installation des dépendances
- Ouvrir un terminal dans votre IDE
- Exécuter la commande suivante pour initialiser le projet:
```shell
npm install
```
### Premier lancement
- Démarrer les conteneurs avec la commande suivante:
```shell
docker-compose up -d
```
- Exécuter la commande suivante pour initialiser la base de données:
```shell
prisma db push
```
- Démarrer l'api avec la commande suivante:
```shell
npm run dev
```
- Créer votre première utilisateur en utilisant l'api `/api/auth/register` avec les informations suivantes:
```json
{
    "lastname" : "*VOTRE NOM*",
    "firstname" : "*VOTRE PRENOM*",
    "email" : "*VOTRE EMAIL*",
    "password" : "*VOTRE MOT DE PASSE*",
    "dateOfBirth" : "*VOTRE DATE DE NAISSANCE*"
}
```
- Eteignez le projet avec un `CTRL` + `C` dans le terminal
- Modifier la variable `INIT` dans le fichier `.env` à `false`
- Exécuter la commande suivante pour relancer le projet:
```shell
npm run dev
```

Vous pouvez maintenant accéder à l'api à l'adresse suivante: `http://localhost:3000`

# Configuration d'Insomnia
- Télécharger et installer [Insomnia](https://insomnia.rest/download)
- Importer le fichier `Insomnia_2024-12-17.json` dans Insomnia
- Modifier les variables d'environnements pour correspondre à votre configuration
- Vous pouvez maintenant tester l'api avec Insomnia
```