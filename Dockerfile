FROM node:18

RUN apt update && apt install -y supervisor
COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf

WORKDIR /minicms

COPY ./backend/package-lock.json ./backend
COPY ./frontend/package-lock.json ./frontend

WORKDIR /minicms/backend
RUN npm ci
WORKDIR /minicms/frontend
RUN npm ci

WORKDIR /minicms

COPY ./backend ./backend
COPY ./backend/.docker.env ./backend/.env

WORKDIR /minicms/backend

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db seed

WORKDIR /minicms
COPY ./frontend ./frontend

WORKDIR /minicms/frontend
RUN npm run build

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 8080