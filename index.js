const {Telegraf} = require('telegraf')
const {message} = require('telegraf/filters')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))

// Command handling
bot.command("recommend", middleware.auth, textHandlers.sendLastestRequest);

bot.command("confession", middleware.auth, textHandlers.addConfession);

bot.command("get_confession", middleware.auth, textHandlers.getConfession);

// Message handling
bot.on("message", middleware.auth, textHandlers.message);

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))