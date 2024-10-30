const {Telegraf, session} = require('telegraf')
const {message} = require('telegraf/filters')
const middleware = require('./middleware/auth.middleware')
const textHandlers = require('./handler/textHandlers')
require('dotenv').config()

global.bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(session());

bot.start((ctx) => ctx.reply('Welcome'))

// Command handling
bot.command("recommend", middleware.auth, textHandlers.sendLastestRequest);

bot.command("confession", middleware.auth, textHandlers.addConfession);

// Message handling
bot.on("message", middleware.auth, textHandlers.message);

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))