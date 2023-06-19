FROM node:16

WORKDIR /app

COPY . .

COPY non_existent_file.txt .


RUN npm install

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]

