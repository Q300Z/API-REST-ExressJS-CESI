#!/bin/sh

# shellcheck disable=SC3046
source .env

# Vérifier que les variables d'environnement nécessaires sont définies
if [ -z "$POSTGRES_HOSTNAME" ] || [ -z "$POSTGRES_PORT" ]; then
  echo "Erreur : Les variables POSTGRES_HOSTNAME ou POSTGRES_PORT ne sont pas définies."
  exit 1
fi

# Attendre que PostgreSQL soit disponible
until nc -z -v -w30 "$POSTGRES_HOSTNAME" "$POSTGRES_PORT"; do
  echo "En attente de PostgreSQL à $POSTGRES_HOSTNAME:$POSTGRES_PORT..."
  sleep 1
done

echo "PostgreSQL est disponible !"

# Exécuter les migrations et générer les fichiers Prisma
npx prisma db push

# Lancer l'application
exec "$@"

