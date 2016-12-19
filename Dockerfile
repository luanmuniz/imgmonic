FROM node:7.2

COPY src/ /opt/imgmonic
WORKDIR /opt/imgmonic
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]