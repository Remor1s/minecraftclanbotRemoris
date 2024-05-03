
/**
 * Запланирует периодическую отправку сообщения в указанном типе чата с заданными интервалами.
 * Функция инициализирует таймер, который отправляет сообщение каждые `interval` минут.
 *
 * @param {Object} bot - объект бота, через который будет происходить отправка сообщений.
 * @param {String} chatType - тип чата, указывающий, где будет отправлено сообщение.
 *                        Допустимые значения:
 *                        - "local" - локальный чат
 *                        - "global" - глобальный чат
 *                        - "clan" - чат клана
 * @param {String} message - текст сообщения, которое будет отправлено.
 * @param {Number} interval - интервал отправки сообщений в минутах.
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