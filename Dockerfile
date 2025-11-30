FROM voltaio/volta:latest AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN volta install node@$(cat package.json | jq -r '.volta.node') && volta install pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM voltaio/volta:latest
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
RUN npm install -g pm2
CMD ["pm2-runtime", "dist/bot.js"]
