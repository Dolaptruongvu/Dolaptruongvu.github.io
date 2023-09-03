FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN apk add --no-cache python3 make g++
RUN npm ci 
COPY . .
CMD ["npm","start","&&", "npm", "run", "watch:js"]