// eventHandlers.js
const {autoMessage} = require("../cron/automessage");
const {processChatMessage} = require("../Handlers/MessageHandler");
const {handleJoinMessage, handleLeaveMessage, handleExclusionMessage} = require("../Handlers/clanMembershipUpdates");

let spawnCount = 0;

function registerEventHandlers(bot) {
    bot.on('message', async (jsonMsg) => {
        const message = jsonMsg.toString();
        console.log(message);
        await processChatMessage(bot, jsonMsg);

        await handleJoinMessage(bot, message);
        await handleLeaveMessage(bot, message);
        await handleExclusionMessage(bot, message);
    });


    bot.on('spawn', async () => {
        console.log('Bot spawned.');
        spawnCount++;
        if (spawnCount === 2) {
            await autoMessage(bot);
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
        bot.sendMessage('local', `/cc v0.25`)
    });

    bot.on('error', (err) => console.log('Error occurred:', err.message));
    bot.on('end', async () => {
        console.log('Connection closed. Attempting to reconnect...');
        setTimeout(startBot, 5000); // Wait 5 seconds before restarting
    });


}

module.exports = { registerEventHandlers };
