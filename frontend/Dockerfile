FROM node

WORKDIR /app/src

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]