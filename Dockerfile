FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json /app
RUN npm install -y
COPY . .
RUN npm run build
CMD ["npm","run","start"]
