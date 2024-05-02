async function isSendInvite(bot, type, username, text) {
    text = text.toLowerCase();
    // Проверка, содержит ли текст фразу "в клан" или "ищу клан"
    if (text.includes("в клан") || text.includes("ищу клан") || text.includes("invite")) {

        if (username && text) {

            if (username === bot.username) {
                return;
            }

            const commandToSend = `/c invite ${username}`;
            bot.sendMessage('command', commandToSend, username);
        }
    }
}

module.exports = isSendInvite;
