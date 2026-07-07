FROM node:24.18-alpine as development

WORKDIR /home-cloud-frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]