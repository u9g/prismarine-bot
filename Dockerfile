FROM node:18

ARG DISCORD_TOKEN=""

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV DISCORD_TOKEN=${DISCORD_TOKEN}

CMD [ "npm", "start" ]