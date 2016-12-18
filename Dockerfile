FROM node:7.2
EXPOSE 8080
CMD [ "/usr/local/bin/node", "run", "index.js" ]

COPY src/ /opt/imgmonic
WORKDIR /opt/imgmonic
RUN node install

