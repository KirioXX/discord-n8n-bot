FROM domjtalbot/volta:latest AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN volta setup && volta install pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM domjtalbot/volta:latest
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN volta setup
ENV NODE_ENV=production
RUN npm install -g pm2
CMD ["pm2-runtime", "dist/bot.js"]
