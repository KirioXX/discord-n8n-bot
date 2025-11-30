import { Client, GatewayIntentBits, Events, Partials, Message } from 'discord.js';
import dotenv from 'dotenv';
import { Action, ActionType } from './Action';

// Load environment variables from .env file
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot is online! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  let action: Action;
  if (message.channel.isDMBased()) {
    action = new Action(ActionType.DM_RECEIVED, message.author.id, message.content);
  } else if (message.mentions.has(client.user!.id)) {
    action = new Action(
      ActionType.CHANNEL_MENTION,
      message.author.id,
      message.content,
      message.channel.id
    );
  } else {
    return;
  }

  try {
    const reply = await action.sendToWebhook();
    await message.reply(reply);
  } catch (error) {
    console.error('❌ Error sending reply:', error);
  }
});

const discord_token = process.env.DISCORD_BOT_TOKEN;
const n8n_webhook_url = process.env.N8N_WEBHOOK_URL;
const n8n_webhook_key = process.env.N8N_WEBHOOK_KEY;

if (!n8n_webhook_url || !n8n_webhook_key) {
  process.exit(1);
}

if (!discord_token) {
  process.exit(1);
}

client.login(discord_token);
