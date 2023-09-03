FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci 
COPY . .
CMD ["npm","start","&&", "npm", "run", "watch:js"]