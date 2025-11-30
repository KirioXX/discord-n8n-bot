FROM node:20-bookworm AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y curl jq bash
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME="/root/.volta"
ENV PATH="$VOLTA_HOME/bin:$PATH"
COPY package.json pnpm-lock.yaml ./
RUN volta install
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-bookworm
WORKDIR /app
# Install Volta
RUN apt-get update && apt-get install -y curl jq bash
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME="/root/.volta"
ENV PATH="$VOLTA_HOME/bin:$PATH"
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN volta install && volta install pm2
ENV NODE_ENV=production
CMD ["pm2-runtime", "dist/bot.js"]
