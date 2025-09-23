
# Base
FROM node:24-slim AS base
WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .

FROM base AS development
CMD ["npm", "run", "development"]

FROM base AS build
RUN npm run build
FROM build AS production
CMD ["npm", "run", "start"]
