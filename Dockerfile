FROM node:9.5.0-alpine

WORKDIR /usr/src/app

# Copy our dependency lists
COPY package*.json ./

RUN npm install

# Copy all your stuff to the image
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
