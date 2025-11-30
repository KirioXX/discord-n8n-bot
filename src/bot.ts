import { Client, GatewayIntentBits, Events, Partials, Message } from 'discord.js';
import dotenv from 'dotenv';
import { Action, ActionType } from './Action';
import { logger } from './logger';

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
  logger.log({
    level: 'info',
    message: `✅ Discord Bot is online`,
    bot_user_id: c.user.id,
  });
});

client.on(Events.MessageCreate, async (message: Message) => {
  logger.log({
    level: 'info',
    message: `Message received`,
    message_id: message.id,
    author_id: message.author.id,
    channel_id: message.channel.id,
  });

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
    logger.log({
      level: 'info',
      message: 'Message ignored',
      message_id: message.id,
      author_id: message.author.id,
      channel_id: message.channel.id,
    });
    return;
  }
  logger.log({
    level: 'info',
    message: 'Processing action',
    action_type: action.type,
    user_id: action.userId,
    content: action.message,
    channel_id: action.channelId,
  });

  try {
    logger.log({
      level: 'info',
      message: 'Sending action to webhook',
      action_type: action.type,
      user_id: action.userId,
      content: action.message,
      channel_id: action.channelId,
    });
    const reply = await action.sendToWebhook();
    logger.log({
      level: 'info',
      message: 'Reply received from webhook',
    });
    await message.reply(reply);
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'Error sending reply',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

const discord_token = process.env.DISCORD_BOT_TOKEN;
const n8n_webhook_url = process.env.N8N_WEBHOOK_URL;
const n8n_webhook_key = process.env.N8N_WEBHOOK_KEY;

if (!n8n_webhook_url || !n8n_webhook_key) {
  logger.log({
    level: 'error',
    message: 'N8N webhook URL or key is missing',
  });
  process.exit(1);
}

if (!discord_token) {
  logger.log({
    level: 'error',
    message: 'Discord bot token is missing',
  });
  process.exit(1);
}

client.login(discord_token);
