
# Base
FROM node:24-slim AS base
WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

FROM base AS development
RUN npm install
CMD ["npm", "run", "development"]

FROM base AS build
RUN npm install
RUN npm run build
FROM build AS production
CMD ["npm", "run", "start"]
