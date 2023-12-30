FROM node:18

RUN apt update && apt install -y supervisor
COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf

WORKDIR /minicms

COPY ./backend ./backend
COPY ./backend/.docker.env ./backend/.env

WORKDIR /minicms/backend
RUN npm ci

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db seed

WORKDIR /minicms
COPY ./frontend ./frontend

WORKDIR /minicms/frontend
RUN npm ci
RUN npm run build

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 8080