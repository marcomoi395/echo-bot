const cron = require("node-cron");
const formSendUser = require("../utils/formSendUser");
const morningMessage = require("../utils/morningMessage");

function sendEveryAfternoon(bot) {
    cron.schedule(
        "30 11 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                process.env.USER_ID,
                formSendUser.expenseNoteReminderAfternoon,
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        process.env.USER_ID,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

function sendEveryEvening(bot) {
    cron.schedule(
        "00 18 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                process.env.USER_ID,
                formSendUser.expenseNoteReminderEvening,
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        process.env.USER_ID,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

function sendGoodMorningWishes(bot) {
    cron.schedule(
        "30 6 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                process.env.USER_ID,
                morningMessage(),
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        process.env.USER_ID,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

function requestToSubmitConfession(bot) {
    cron.schedule(
        "00 23 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                process.env.USER_ID,
                formSendUser.confessionReminder,
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        process.env.USER_ID,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

module.exports = (bot) => {
    sendEveryAfternoon(bot);
    sendEveryEvening(bot);
    sendGoodMorningWishes(bot);
    requestToSubmitConfession(bot);
};