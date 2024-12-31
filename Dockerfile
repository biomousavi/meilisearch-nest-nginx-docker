FROM node:22.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build && npm prune --production


FROM gcr.io/distroless/nodejs22-debian12 AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json