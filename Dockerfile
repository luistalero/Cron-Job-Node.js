FROM node:18-alpine  AS base

ENV NODE_ENV=local

WORKDIR /app

COPY src/package*.json .

RUN npm install && npm cache clean --force

COPY src .

EXPOSE 3000

ENV TZ America/Bogota

FROM base AS local

CMD ["npm", "run", "dev"]