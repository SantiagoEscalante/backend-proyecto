FROM node:18

WORKDIR /usr/src/app

COPY . .

EXPOSE 8085

CMD ["node", "servidorLogin.js"]