FROM node:7.2
EXPOSE 8080

COPY config.yml /opt/imgmonic/
COPY package.json /opt/imgmonic/
COPY src/ /opt/imgmonic/src

WORKDIR /opt/imgmonic
RUN npm install

CMD [ "npm", "start" ]

