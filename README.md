# Discord N8N Bot

Forwards Discord messages to HTTP endpoints and integrates with N8N workflows.

## Features

- Discord to HTTP forwarding
- TypeScript codebase
- Multi-arch Docker image (amd64/arm64)
- Volta-managed Node, pnpm, pm2
- Easy Docker Compose deployment

## Quick Start

**Docker Compose:**

```bash
docker compose up -d
```

Edit `docker-compose.yml` to set your environment variables.

**Local Development:**

```bash
pnpm install
pnpm run dev
```

See docs for environment variable setup.

## Prerequisites

- Discord Bot Token
- Docker & Docker Compose
- (Optional) Node.js & pnpm for local dev

## Documentation

- [Deployment & N8N Integration](docs/DEPLOYMENT.md)
- [Discord Bot Token Setup](https://discord.com/developers/applications)

---

For full setup, environment variables, and N8N instructions, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Multi-arch & Volta

- The Docker image is built for both amd64 and arm64 (Raspberry Pi supported)
- Uses Volta for Node, pnpm, and pm2 version management

## Updating

To update, pull the latest image and restart:

```bash
docker compose pull
docker compose up -d
```

## Troubleshooting

- Check container logs: `docker compose logs discord-bot`
- Ensure environment variables are set correctly
- Verify Discord bot token and N8N webhook URL

---

For deployment and N8N setup, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## How It Works

The bot listens for direct messages and automatically replies with "Hallo World" to any message it receives in DMs. It ignores messages from other bots to prevent infinite loops.

## Project Structure

```

.
├── src/
│ └── bot.ts # Main bot code
├── dist/ # Compiled JavaScript (generated)
├── .env # Environment variables (create this)
├── .gitignore # Git ignore rules
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── README.md # This file

```

## Troubleshooting

- **Bot doesn't respond to DMs**: Make sure the bot has the necessary intents enabled in the Discord Developer Portal
- **"DISCORD_BOT_TOKEN is not defined" error**: Check that your `.env` file exists and contains a valid token
- **Bot can't read messages**: Ensure you've enabled the MESSAGE CONTENT INTENT in the Discord Developer Portal
