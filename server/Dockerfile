FROM node:22.18.0

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 5000 

CMD ["sh", "-c", "npm run server && npm run dev"]