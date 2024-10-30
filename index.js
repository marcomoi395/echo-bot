const {Telegraf, session} = require('telegraf')
const middleware = require('./middleware/auth.middleware')
const textHandlers = require('./handler/textHandlers')
const scheduleDailyMessage = require("./handler/scheduleDailyMessage");
const axios = require('axios');
const {connect} = require("./config/database");
require('dotenv').config()

global.bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(session());

connect();

const syncData = async () => {
    try {
        // Thay đổi URL dưới đây thành đường dẫn bạn muốn truy cập
        const response = await axios.get('http://app:3000/gateways/start-gate?name=mb_bank_1&time_in_sec=60');
        console.log('Đồng bộ hóa thành công:', response.data);
    } catch (error) {
        console.error('Lỗi khi đồng bộ hóa:', error);
    }
};

// Schedule Daily Message
scheduleDailyMessage(bot);

bot.start((ctx) => ctx.reply('Welcome'))

// Command handling
bot.command("recommend", middleware.auth, textHandlers.sendLastestRequest);

bot.command("confession", middleware.auth, textHandlers.addConfession);

bot.command('syncBank', (ctx) => {
    ctx.reply('Đang thực hiện đồng bộ hóa...');
    syncData();
    ctx.reply('Đã hoàn tất đồng bộ hóa!');
})

// Message handling
bot.on("message", middleware.auth, textHandlers.message);

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))