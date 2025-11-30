FROM marcaureln/volta:latest
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN volta install pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM marcaureln/volta:latest
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN volta install pm2
ENV NODE_ENV=production
CMD ["pm2-runtime", "dist/bot.js"]
