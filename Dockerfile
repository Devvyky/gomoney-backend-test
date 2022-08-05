FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY --from=build /usr/src/app/dist ./dist


CMD [ "node", "dist/src/app.js" ]