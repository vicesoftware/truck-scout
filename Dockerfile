FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Remove the build step for now
# RUN npm run build

CMD ["npm", "start"]