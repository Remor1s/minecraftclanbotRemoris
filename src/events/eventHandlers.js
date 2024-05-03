// eventHandlers.js
const { handlePlayerJoinedClan, handlePlayerLeftClan } = require('./clanEvents');
const {autoMessage} = require("../cron/automessage");
const {processChatMessage} = require("../Handlers/HandlerMessage");


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


}

module.exports = { registerEventHandlers };
