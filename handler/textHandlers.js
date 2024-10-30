const regex = require("../utils/regex");
const Markup = require("telegraf/markup");
// const addConfessionService = require("../services/addConfession.service");
const Notion = require("../service/notion.service");
const {recordedSuccessfully} = require("../utils/formSendUser");
const getTimeUntilEndOfDay = require("../utils/getTimeUntilEndOfDay");
const {addToNotes} = require("../utils/addToNotes");
const {addExpenseAndIncomeLog} = require("./callbackHandlers");

var notes = [];

// Send Message
module.exports.message = async (ctx) => {
    const message = ctx.message.text;
    try {
        if (ctx.session.logging) {
            // await addConfessionService(ctx, message);
        } else if (regex.checkRegexExpense(message)) {
            const messageRegex = message.match(/^(.+?)\s(\d+)\s*(.+)?$/);

            const currentDate = new Date();
            const date = new Date(currentDate.getTime());
            const amount = Number(messageRegex[2]);
            let description = messageRegex[1];
            let response;

            if (message.startsWith("t ")) {
                description = description.slice(2);
                response = await Notion.addBudgetTracker(description, amount, date, "Income")
            } else {
                response = await Notion.addBudgetTracker(description, amount, date, "Expense")
            }

            // Save data to session
            if (response) {
                addToNotes(notes, message);
            }

            const sentMessage = await ctx.reply(recordedSuccessfully(message), {
                parse_mode: "HTML",
            });

            // Xóa tin nhắn của người dùng
            await ctx.deleteMessage(ctx.message.message_id);

            // Xóa tin nhắn của bot vào cuối ngày
            setTimeout(async () => {
                try {
                    await ctx.deleteMessage(sentMessage.message_id);
                } catch (error) {
                }
            }, getTimeUntilEndOfDay());
        } else {
            const sentMessage = await ctx.reply("Đang nói gì vậy mình không hiểu 😅",);
            setTimeout(async () => {
                try {
                    await ctx.deleteMessage(ctx.message.message_id);
                    await ctx.deleteMessage(sentMessage.message_id);
                } catch (error) {
                }
            }, 5000);
        }
    } catch (e) {
        ctx.reply(e);
    }
};

module.exports.sendLastestRequest = async (ctx) => {
    try {
        if (notes.length === 0) {
            const sentMessage = await ctx.reply("📋 Danh sách ghi chú trống",);
            return;
        }

        let buttons = [];
        notes.forEach((chat) => {
            buttons.push([Markup.button.callback(chat, `sendMessage:${chat}`)]);
        });

        const timeSelectionIncomeKeyboard = Markup.inlineKeyboard(buttons);

        const sentMessage = await ctx.reply("📋 Dưới đây là một vài ghi chú gần nhất:", timeSelectionIncomeKeyboard,);

        // Xóa keyboard sau 20s không hoạt động
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(sentMessage.message_id);
            } catch (error) {
            }
        }, 20000);

        // Xóa tin nhắn của người dùng
        await ctx.deleteMessage(ctx.message.message_id);

        await addExpenseAndIncomeLog(ctx);
    } catch (e) {
        ctx.reply("⚠️ Xin lỗi, đã xảy ra lỗi khi tải các ghi chú gần nhất. Vui lòng thử lại sau. 🥹",);
    }
};

module.exports.addConfession = async (ctx) => {
    const sentMessage = await ctx.reply("Mình luôn sẵn sàng lắng nghe, dù là chuyện vui hay buồn. Mình ở đây nếu bạn cần. Hãy nói điều gì đó nhá 😘",);
    ctx.session.logging = true;
    ctx.session.sentMessageId = sentMessage.message_id;

    // Xóa tin nhắn của người dùng
    await ctx.deleteMessage(ctx.message.message_id);

    // Xóa tin nhắn khi không nhập gì trong 5p

    setTimeout(async () => {
        if (ctx.session.logging === true) {
            try {
                ctx.session.logging = false;
                await ctx.deleteMessage(sentMessage.message_id);
            } catch (error) {
            }
        }
    }, 300000);
};