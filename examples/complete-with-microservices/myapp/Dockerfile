FROM node:alpine

WORKDIR /home/node/app

COPY package.json ./
RUN npm install --production
COPY index.js ./
COPY static static/

EXPOSE 3000

CMD [ "npm", "start" ]
