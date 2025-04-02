# Etapa de build
FROM node:21 AS builder
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro para aproveitar o cache
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante dos arquivos e constrói a aplicação
COPY . .
RUN npm run build

# Etapa de produção
FROM nginx:alpine
COPY --from=builder /app/dist/login-page/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
