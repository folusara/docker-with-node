FROM node:lts-alpine

WORKDIR /sockets

# COPY . .
COPY package*.json ./

 RUN npm ci --only=production

USER node

CMD [ "npm", "start" ]

EXPOSE 4000