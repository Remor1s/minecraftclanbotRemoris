
/**
 * Обработка события выхода игрока из клана.
 * @param {string} username Имя пользователя, вышедшего из клана.
 */
async function handlePlayerLeftClan(bot, username) {
    console.log(`Player ${username} has left the clan.`);
}

async function handlePlayerJoinedClan(bot, username) {
    console.log(`Player ${username} has joined the clan.`);
    bot.sendMessage('clan', `Привет, ${username}! Наш телеграмм канал &at.me/extrasideclan`)
}


module.exports = {
    handlePlayerLeftClan,
    handlePlayerJoinedClan,
};


