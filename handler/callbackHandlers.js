const regex = require("../utils/regex");
const formSendUser = require("../utils/formSendUser");
const getTimeUntilEndOfDay = require('../utils/getTimeUntilEndOfDay');
const Notion = require("../service/notion.service");

module.exports.addExpenseAndIncomeLog = async (ctx) => {
    bot.action(/sendMessage:(.+)/, async (ctx) => {
        const match = ctx.callbackQuery.data.match(/sendMessage:(.+)/);
        let response;
        if (match) {
            const message = match[1];
            if (regex.checkRegexExpense(message)) {
                const messageRegex = message.match(/^(.+?)\s(\d+)\s*(.+)?$/);
                const currentDate = new Date();
                const date = new Date(currentDate.getTime());
                const amount = Number(messageRegex[2]);
                let description = messageRegex[1];
                // Income
                if (message.startsWith('t ')) {
                    description = description.slice(2);
                    try {
                        response = await Notion.addBudgetTracker(description, amount, date, "Income")

                        if (response) {
                            const sentMessage = await ctx.reply(formSendUser.recordedSuccessfully(message), {
                                parse_mode: "HTML"
                            });

                            // Xóa tin nhắn của bot vào cuối ngày
                            setTimeout(async () => {
                                try {
                                    await ctx.deleteMessage(sentMessage.message_id);
                                } catch (error) {
                                }
                            }, getTimeUntilEndOfDay());

                        } else {
                            ctx.reply("Error");
                        }
                    } catch (e) {
                        ctx.reply('Error');
                    }
                } else {
                    try {
                        response = await Notion.addBudgetTracker(description, amount, date, "Expense")
                        if (response) {
                            const sentMessage = await ctx.reply(formSendUser.recordedSuccessfully(message), {
                                parse_mode: "HTML"
                            });

                            // Xóa tin nhắn của bot vào cuối ngày
                            setTimeout(async () => {
                                try {
                                    await ctx.deleteMessage(sentMessage.message_id);
                                } catch (error) {
                                }
                            }, getTimeUntilEndOfDay());

                        } else {
                            ctx.reply("Error");
                        }
                    } catch (e) {
                        ctx.reply('Error');
                    }
                }
            } else {
                ctx.reply("Syntax error");
            }
        } else {
            ctx.answerCbQuery('Định dạng callback query không hợp lệ  ');
        }
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    })
}