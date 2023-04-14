FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]

