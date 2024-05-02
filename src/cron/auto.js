
/**
 * Планирует повторную отправку сообщения с заданными интервалами.
 * @param {Object} bot - объект бота
 * @param {String} chatType - тип чата, в котором будет отправлено сообщение
 * @param {String} message - сам текст
 * @param {Number} interval - интервал. в минутах
 */
async function scheduleMessage(bot, chatType, message, interval) {
    const intervalInMs = interval * 60 * 1000;

    setInterval(() => {
        bot.sendMessage(chatType, message);
        console.log(`Sent scheduled message in '${chatType}' chat: ${message}`);
    }, intervalInMs);

    console.log(`Scheduled message every ${interval} minutes in '${chatType}' chat.`);
}

module.exports = { scheduleMessage };