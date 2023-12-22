FROM node:18

RUN apt update && apt install -y supervisor
COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf

WORKDIR /minicms

COPY ./backend ./backend
COPY ./backend/.docker.env ./backend/.env
COPY ./frontend ./frontend

WORKDIR /minicms/backend
RUN npm ci
RUN npx prisma generate
RUN npx prisma migrate deploy

WORKDIR /minicms/frontend
RUN npm ci
RUN npm run-script build-docker

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 8080