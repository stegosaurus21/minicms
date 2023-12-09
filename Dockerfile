FROM node:18

RUN apt update && apt install -y supervisor
COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf

WORKDIR /minicms

COPY ./backend ./backend
COPY ./backend/.docker.env ./backend/.env
COPY ./frontend ./frontend

WORKDIR /minicms/backend
RUN npm install
RUN mkdir ./static

WORKDIR minicms/frontend
RUN npm install
RUN npm run build-docker

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 3000