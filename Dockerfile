FROM ubuntu:trusty

MAINTAINER kkpoon <noopkk@gmail.com>

RUN echo Asia/Hong_Kong | tee /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get update && apt-get -y install curl && curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get install -y nodejs build-essential

Add . /appserver

WORKDIR /appserver

RUN npm install

ENV MYSQL_HOST mysql
ENV MYSQL_USERNAME root
ENV MYSQL_DATABASE wordpress

EXPOSE 3000

CMD npm start
