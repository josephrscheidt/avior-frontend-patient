# To build container:
# docker build --rm -f .docker/prod.dockerfile -t jscheidt/avior:patient .

FROM node:11.6.0-alpine as node
COPY . ./app
WORKDIR /app
RUN npm i \
&& $(npm bin)/ng build --prod

FROM nginx:alpine
COPY --from=node /app/dist/avior-patient /usr/share/nginx/html
COPY --from=node /app/.docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80