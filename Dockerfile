FROM node:18

RUN apt update && apt install -y supervisor

WORKDIR /minicms

COPY ./backend/package-lock.json ./
COPY ./backend/package.json ./

RUN npm ci

COPY ./backend/prisma ./prisma
COPY ./backend/.docker.env ./.env
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db seed

COPY ./backend .

COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 8080