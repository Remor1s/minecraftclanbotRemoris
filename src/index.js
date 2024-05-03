// main.js
const mineflayer = require('mineflayer');
const { registerEventHandlers } = require('./events/eventHandlers');
const {initializeMessageQueue, getQueueInstance} = require("./messageQueueSingleton");
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || './.env' });

async function startBot() {
    try {
        const bot = mineflayer.createBot({
            host: process.env.MC_HOST,
            username: process.env.MC_USERNAME,
            password: process.env.MC_PASSWORD,
            version: process.env.MC_VERSION,
        });

        global.bot = bot;
        initializeMessageQueue(bot);
        bot.sendMessage = function(chatType, message, username = '', delay = 4000) {
            getQueueInstance().enqueueMessage(chatType, message, username, delay);
        };
        registerEventHandlers(bot);

        bot.on('login', async () => {
            console.log('Logged in!');
            setTimeout(() => bot.chat(`/login ${process.env.BOT_PASSWORD}`), 1000)
            setTimeout(() => bot.chat("/surv1"), 3000);
            bot.sendMessage('local', `/cc v0.1`)
        });

        bot.on('error', (err) => console.log('Error occurred:', err.message));
        bot.on('end', async () => {
            console.log('Connection closed. Attempting to reconnect...');
            setTimeout(startBot, 5000); // Wait 5 seconds before restarting
        });
    } catch (error) {
        console.error('Error starting bot:', error);
    }
}

startBot();
