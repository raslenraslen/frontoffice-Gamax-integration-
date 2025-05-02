# === Dockerfile Simple avec ng serve (POUR DÉVELOPPEMENT) ===

# 1. Choisir une image Node.js
FROM node:18-alpine

# 2. Définir le répertoire de travail dans le conteneur
WORKDIR /app

# 3. Copier package.json et package-lock.json pour le cache
COPY package.json package-lock.json* ./

# 4. Installer les dépendances (avec le contournement OBLIGATOIRE pour ton projet)
RUN npm install --legacy-peer-deps

# 5. Copier TOUT le reste de ton code source
#    !!! Assure-toi d'avoir un fichier .dockerignore pour exclure node_modules, .git, dist etc. !!!
COPY . .

# 6. Indiquer que le port 4200 sera utilisé (port par défaut de ng serve)
EXPOSE 4200

# 7. Commande pour démarrer l'application avec le serveur de développement Angular
#    'npx' exécute la version de 'ng' de ton projet.
#    '--host 0.0.0.0' est INDISPENSABLE pour y accéder depuis l'extérieur du conteneur.
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
