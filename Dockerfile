FROM node:16

WORKDIR /backend

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "start:dev"]