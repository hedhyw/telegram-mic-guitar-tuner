#!/usr/bin/node
//
// This is an optional telegram bot, that just responds with a `welcome` message.

import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const text = `Hello!

🎸 This is a bot that helps to tune guitars!
It uses the microphone to determine the frequency of the sound and help you to correctly adjust each string of your guitar.

Currently, it supports only the standart tuning:
- 1 (e4)	329.63 Hz (the thinnest string)
- 2 (B3)	246.94 Hz
- 3 (G3)	196.00 Hz
- 4 (D3)	146.83 Hz
- 5 (A2)	110.00 Hz
- 6 (E2)	082.41 Hz (the thickest string)

Open the following link to start: https://t.me/micguitartunerbot/app

⚠️ Not all Telegram clients support access to a microphone; the application cannot work in this case.
⚠️ Mobile devices should have support.
⚠️ Make sure there is no background noise.

The bot does not collect any usage information and it is open-source: <a href="https://github.com/hedhyw/telegram-mic-guitar-tuner">Github</a>.
`;

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
  });
});
