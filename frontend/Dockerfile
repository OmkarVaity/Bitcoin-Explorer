# Docker file for frontend
# Stage 1: Build the app
From node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .
RUN npm run build

# Stage 2: Serve the app
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]