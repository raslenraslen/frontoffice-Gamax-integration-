# Étape 1 : Construction de l'application Angular
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste du code source
COPY . .

# Construire l'application pour production
RUN npm run build --prod

# Étape 2 : Image finale NGINX pour servir l'application
FROM nginx:stable-alpine

# Copier les fichiers construits dans le répertoire NGINX
COPY --from=build /app/dist/* /usr/share/nginx/html

# Copier la configuration par défaut de NGINX (optionnel si customisation)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
