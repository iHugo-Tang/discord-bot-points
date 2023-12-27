import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { users } from './schema/users.js';
import { logs } from './schema/logs.js';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { asc, desc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL
// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);
await migrate(db, { migrationsFolder: './drizzle' });

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  console.log(JSON.stringify(req.body));
  // const { type, id, data, user } = req.body;
  const { type, id, data, member } = req.body;
  let user = member?.user;
  if (!user) {
    user = req.body.user;
  }
  if (!user) {
    console.log('no user');
    return res.status(400).send({ error: 'no user' });
  }

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'register') {
      await db.insert(users).values({
        createdAt: new Date(),
        discordUid: user.id,
        discordUsername: user.username,
        points: 0,
      }).onConflictDoNothing();
      const allUsers = await db.select().from(users);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `恭喜你注册成功! 目前有${allUsers.length}人注册了`,
        },
      });
    } else if (name === 'points') {
      const p = await db.select({
        points: users.points,
        logs,
      })
        .from(users)
        .leftJoin(logs, eq(users.id, logs.uid))
        .where(eq(users.discordUid, user.id))
        .orderBy(desc(logs.createdAt))
        .limit(10);
      let content = `
您目前的积分: ${p[0].points}
\n以下是您最近的积分变动记录:`;
      p.forEach((item, index) => {
        content += `\n${index + 1}. ${item.logs.desc}: ${item.logs.points * item.logs.type}`;
      });
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content,
        },
      });
    } else if (name === 'goods') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '目前没有可以兑换的商品',
        },
      });
    } else if (name === 'leaderboard') {
      const u = await db.select().from(users).orderBy(desc(users.points)).limit(10)
      let content = '';
      u.forEach((user, index) => {
        content += `\n${index + 1}. ${user.nickName ?? user.discordUsername}: ${user.points}`;
      });
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content,
        },
      });
    } else {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
