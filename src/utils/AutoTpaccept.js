async function handleTeleportRequest(bot, message) {
    const teleportRegex = /^\| (.+?) просит телепортироваться к Вам\.$/;
    const match = message.match(teleportRegex);

    if (match) {
        const requesterNickname = match[1];
        console.log(`${requesterNickname} запрос тп. я принял`);
        bot.sendMessage('local', '/tpaccept');
    }
}


module.exports = {
    handleTeleportRequest,
};