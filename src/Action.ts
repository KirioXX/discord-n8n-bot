import { MessagePayload, MessageReplyOptions } from "discord.js";
import { ActionResponseSchema } from "./Action.schema";

export enum ActionType {
  DM_RECEIVED = 'direct_message_received',
  CHANNEL_MENTION = 'channel_mention_received',
}

interface MessageBody {
  type: ActionType;
  userId: string;
  message: string;
  channelId?: string;
}

export class Action {
  type: ActionType;
  userId: string;
  message: string;
  channelId?: string;

  constructor(type: ActionType, userId: string, message: string, channelId?: string) {
    this.type = type;
    this.userId = userId;
    this.message = message;
    this.channelId = channelId;
  }

  async sendToWebhook(): Promise<string | MessagePayload | MessageReplyOptions> {
    const body: MessageBody = {
      type: this.type,
      userId: this.userId,
      message: this.message,
    };

    if (this.channelId) {
      body.channelId = this.channelId;
    }

    const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Homeboy-Auth-X': process.env.N8N_WEBHOOK_KEY!,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed to send webhook: ${response.statusText}`);
    }
    const data = await response.json();
    const parsedData = ActionResponseSchema.parse(data);
    return parsedData.answer;
  }
}
