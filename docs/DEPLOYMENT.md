# Deploying Discord N8N Bot & N8N Integration

## Prerequisites

- Docker & Docker Compose installed
- Discord Bot Token
- Access to GitHub Container Registry (ghcr.io)
- N8N instance (self-hosted or cloud)

## Deploying the Bot

1. **Clone the repository:**

   ```bash
   git clone https://github.com/KirioXX/discord-n8n-bot.git
   cd discord-n8n-bot
   ```

2. **Create a `.env` file:**

   ```env
   DISCORD_TOKEN=your_discord_token_here
   # Add other environment variables as needed
   ```

3. **Edit `docker-compose.yml` if needed:**
   - Set your environment variables
   - Adjust ports/volumes as required

4. **Pull and run the Docker image:**
   ```bash
   docker compose up -d
   # or
   docker-compose up -d
   ```
   The image will be pulled from `ghcr.io/kirioxx/discord-n8n-bot:latest`.

## Updating the Bot

- To update, pull the latest image and restart:
  ```bash
  docker compose pull
  docker compose up -d
  ```

## N8N Integration

1. **Set up N8N:**
   - Deploy N8N (see [N8N docs](https://docs.n8n.io/))
   - Make sure N8N is accessible from your bot (network/firewall)

2. **Create a Webhook in N8N:**
   - Add a Webhook node in your workflow
   - Set the HTTP method and path
   - Copy the webhook URL
   - Setup Header authentication and copy the credentials

3. **Configure the bot to forward messages to N8N:**
   - Set the N8N webhook URL in your bot's config or `.env` file (if supported)
   - Example:
     ```env
     N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/discord
     N8N_AUTH_HEADER=your_auth_header_value
     ```

4. **Test the integration:**
   - Send a message to your Discord bot
     - Via DM or in a server channel
   - Check N8N for received webhook events

## Troubleshooting

- Check container logs: `docker compose logs discord-bot`
- Ensure environment variables are set correctly
- Make sure your Discord bot token is valid
- Verify N8N webhook URL and network access

---

For more details, see the main README or open an issue in the repository.
