FROM node:18

RUN apt update && apt install -y supervisor
COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf

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

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 8080