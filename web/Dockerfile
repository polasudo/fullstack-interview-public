FROM node:20
WORKDIR /app
COPY web/package.json web/package-lock.json /app/
RUN npm install
COPY web /app/
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]