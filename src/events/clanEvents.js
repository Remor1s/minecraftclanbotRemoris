
/**
 * Обработка события выхода игрока из клана.
 * @param {string} username Имя пользователя, вышедшего из клана.
 */
async function handlePlayerLeftClan(username) {
    console.log(`Player ${username} has left the clan.`);
}

async function handlePlayerJoinedClan(username) {
    console.log(`Player ${username} has joined the clan.`);
}


module.exports = {
    handlePlayerLeftClan,
    handlePlayerJoinedClan,
};


