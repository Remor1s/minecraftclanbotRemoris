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
    } catch (error) {
        console.error('Error starting bot:', error);
    }
}
startBot();
