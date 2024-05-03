// eventHandlers.js
const { handlePlayerJoinedClan, handlePlayerLeftClan } = require('./clanEvents');
const {autoMessage} = require("../cron/automessage");
const {processChatMessage} = require("../Handlers/MessageHandler");


let spawnCount = 0;

function registerEventHandlers(bot) {
    bot.on('message', async (jsonMsg) => {
        const message = jsonMsg.toString();
        console.log(message);
        await processChatMessage(bot, jsonMsg);

        const joinMatch = message.match(/\[\*\]\s+(\S+)\s+присоеденился к клану\./i);
        if (joinMatch) {
            console.log(joinMatch);
            const username = joinMatch[1];
            await handlePlayerJoinedClan(username);
        }
        const leaveMatch = message.match(/(\S+)\s+покинул клан\./i);
        if (leaveMatch) {
            console.log(leaveMatch);
            const username = leaveMatch[1];
            await handlePlayerLeftClan(username);
        }
        const exclusionMatch = message.match(/(\S+) был исключен из клана игроком \S+/i);
        if (exclusionMatch) {
            const username = exclusionMatch[1];
            await handlePlayerLeftClan(username);
        }
    });

    bot.on('spawn', () => {
        console.log('Bot spawned.');
        if (spawnCount === 2) {
            autoMessage(bot);
        }
    });

    bot.on('entitySpawn', (entity) => {
        if (entity.type === 'player' && bot.sendInvite) {
            bot.sendMessage('local', `/c invite ${entity.username}`)
        }
    });

    bot.on('login', async () => {
        console.log('Logged in!');
        setTimeout(() => bot.chat(`/login ${process.env.BOT_PASSWORD}`), 1000)
        setTimeout(() => bot.chat("/surv1"), 3000);
        bot.sendMessage('local', `/cc v0.2`)
    });

    bot.on('error', (err) => console.log('Error occurred:', err.message));
    bot.on('end', async () => {
        console.log('Connection closed. Attempting to reconnect...');
        setTimeout(startBot, 5000); // Wait 5 seconds before restarting
    });


}

module.exports = { registerEventHandlers };
