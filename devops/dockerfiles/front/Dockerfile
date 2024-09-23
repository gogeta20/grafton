FROM node:lts

WORKDIR /app

COPY ../../project/front/package*.json ./

RUN npm install -g pnpm vite

COPY ../../project/front .

RUN pnpm install

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
