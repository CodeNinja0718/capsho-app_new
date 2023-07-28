
# develop stage
FROM node:14.19.0-alpine AS develop-stage
RUN apk update && apk add bash
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
RUN yarn global add @quasar/cli
RUN yarn install
COPY . .

# build stage
FROM develop-stage AS build-stage
RUN quasar build - spa

# production stage
FROM nginx:1.17.5-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
