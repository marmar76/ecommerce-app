# Dockerfile
FROM node:14

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

RUN curl "https://install.meteor.com/" | sh

COPY .
WORKDIR .

RUN chmod -R 700 .meteor/local
RUN meteor npm install

EXPOSE 3000
CMD ["npm", "start"]