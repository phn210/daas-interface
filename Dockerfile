FROM node:14.17-alpine as build

WORKDIR /app

RUN apk add --no-cache git

COPY package.json /app
RUN yarn install --silent
COPY . /app
RUN yarn build

# prepare nginx
FROM nginx:1.19.8-alpine
COPY --from=build /app/build /var/www/governance
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
