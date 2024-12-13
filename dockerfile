# Backend Dockerfile

# Basis-Image für Node.js
FROM node:18 AS backend

# Arbeitsverzeichnis für das Backend setzen
WORKDIR /app

# Backend-spezifische Abhängigkeiten installieren
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Backend-Code kopieren
COPY backend/ ./

# Port für die App setzen
EXPOSE 8080

# Startbefehl für das Backend
CMD ["node", "server.js"]

# ------ Frontend Dockerfile für Next.js ------

# Basis-Image für den Build-Prozess
FROM node:18 AS frontend-build

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten installieren
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Frontend-Code kopieren und bauen
COPY frontend/ ./
RUN npm run build

# Produktiv-Image erstellen
FROM node:18 AS frontend

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten für die Produktivumgebung installieren
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --only=production

# Gebaute Dateien vom Build-Image kopieren
COPY --from=frontend-build /app/.next /app/.next
COPY --from=frontend-build /app/public /app/public
COPY --from=frontend-build /app/node_modules /app/node_modules
COPY --from=frontend-build /app/package.json /app/package.json

# Umgebungsvariablen setzen (falls erforderlich)
ENV NODE_ENV=production
ENV PORT=8080

# Port freigeben
EXPOSE 8080

# Startbefehl für den Next.js-Server
CMD ["npm", "run", "start"]
