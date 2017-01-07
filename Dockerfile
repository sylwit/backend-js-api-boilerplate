FROM node:6.3

MAINTAINER Sylvain Witmeyer <sylvain.witmeyer@gmail.com>

RUN mkdir /app
WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY . /app
RUN npm run build && rm -Rf node_modules src

RUN npm install --production

EXPOSE 80
CMD npm start
