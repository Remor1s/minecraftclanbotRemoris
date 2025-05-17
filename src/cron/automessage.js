const { scheduleMessage } = require("./auto");


async function autoMessage(bot) {
    console.log("autoMessage");
    await scheduleMessage(bot, 'clan', 'Вступай в наш канал за новостями о розыгрышах: t.me/ferndal', 5)
    await scheduleMessage(bot, 'global', '&f&lВсем привет! Вступй в наш клан. У нас каждую неделю проводятся розыгрыши на кейсы, где поучаствовать может каждый! Вступить в клан можно по команде /m ferndalebot j ', 10)
    //await scheduleMessage(bot, 'global', 'набор в клан', 15)
    //await scheduleMessage(bot, 'local', 'Вступай в наш тгк за новостями о розыгрышах: https://t.me/ferndal', 11)
}

module.exports = { autoMessage };
