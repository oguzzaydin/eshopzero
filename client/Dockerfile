FROM node:12.16.1-alpine as build-stage
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY client/package.json /app/package.json
COPY client/yarn.lock /app/yarn.lock
RUN yarn install
COPY client /app


RUN yarn build

FROM nginx:1.16.0-alpine

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]