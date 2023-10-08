FROM node:lts-alpine3.18 as builder

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL
RUN echo "Building for ${REACT_APP_API_URL}"

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .

RUN yarn build

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
