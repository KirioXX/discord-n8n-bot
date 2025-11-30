FROM marcaureln/volta:latest AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN volta install node && volta install pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM marcaureln/volta:latest
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN volta install node && volta install pm2
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD pm2 status | grep online || exit 1
CMD ["pm2-runtime", "dist/bot.js"]
