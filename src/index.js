//main.js
const mineflayer = require('mineflayer');
const botConfig = require('./config/botConfig');
const { parseMessage } = require('./utils/parse');
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || './.env' });
const { handlePlayerJoinedClan, handlePlayerLeftClan } = require('./events/clanEvents'); // Функции обработки
const { initializeMessageQueue, getQueueInstance} = require('./messageQueueSingleton');
const {scheduleMessage} = require("./cron/auto");
const isSendInvite = require("./utils/sendInvite");

// да простят меня боги за это
const responsePatternsInvite = [
    /уже состоит в клане/i,
    /принял предложение/i,
    /отклонил/i,
    /пригласил/i,
    /принял предложение/i,
];



let messageQueue;

const COMMAND_PREFIX = process.env.MC_COMMAND_PREFIX;
let spawnCount = 0;

async function processChatMessage(bot, jsonMsg, commandsRegistry) {
    const messageText = jsonMsg.toString();
    try {
        const parsedMessage = await parseMessage(bot, messageText, jsonMsg);
        if (!parsedMessage) return;
        console.log(parsedMessage);

        const { type, nick, message } = parsedMessage;

        if (type === 'private' && message.toLowerCase().includes('join')) {
            const messageQueue = getQueueInstance();
            const commandToSend = `/c invite ${nick}`;
            const response = await messageQueue.sendMessageAndWaitForReply(commandToSend, responsePatternsInvite, 5000);
            await bot.sendMessage(type, response, nick);
        } else if (message.toLowerCase().includes('join')) {
            bot.sendMessage('local', `/c invite ${nick}`)
        } else if (message.toLowerCase().includes('sendinvite') && nick === 'Remoris') {
            bot.sendInvite = !!bot.sendInvite;
            bot.sendMessage(type, `${bot.sendInvite}`)
        }

        await isSendInvite(bot, type, nick, message);


    } catch (error) {
        console.error("Error processing message:", error);
    }
}


async function startBot() {
    try {

        //const bot = mineflayer.createBot(botConfig);

        const bot = mineflayer.createBot({
            host: process.env.MC_HOST,
            username: process.env.MC_USERNAME,
            password: process.env.MC_PASSWORD,
            version: process.env.MC_VERSION,
            commandPrefix: process.env.MC_COMMAND_PREFIX,
        });
        global.bot = bot;
        initializeMessageQueue(bot); // Инициализация системы очереди сообщений

        bot.sendMessage = function(chatType, message, username = '', delay = 8000) {
            getQueueInstance().enqueueMessage(chatType, message, username, delay);
        };

        bot.sendInvite = false;

        bot.on('death', () => {
            console.log(`Бот умер`);
        });

        bot.on('message', async (jsonMsg) => {
            if (spawnCount >= 2) {
                await processChatMessage(bot, jsonMsg);

            }

            const message = jsonMsg.toString();
            console.log(message);

            // Учет возможных опечаток и различного форматирования в сообщении
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



        bot.on('login', async () => {
            console.log('Logged in!');
            setTimeout(() => bot.chat(`/login ${process.env.BOT_PASSWORD}`), 1000)
            setTimeout(() => bot.chat("/surv1"), 3000)
            setTimeout(() => bot.chat("/tpa merkz"), 6000)
        });

        bot.on('error', (err) => console.log('Error occurred:', err.message));
        bot.on('end', async () => {
            console.log('Connection closed. Attempting to reconnect...');
            setTimeout(startBot, 5000); // Wait 5 seconds before restarting
        });
        bot.on('spawn', () => {
            console.log('Bot spawned.');
            spawnCount++; // Увеличиваем счетчик при каждом событии spawn

            // Проверяем, является ли это вторым событием spawn
            if (spawnCount === 2) {
                activateFunctions(bot);
                }
        });

        bot.on('entitySpawn', (entity) => {
            if (entity.type === 'player' && bot.sendInvite) {
                bot.sendMessage('local', `/c invite ${entity.username}`)
            }
        });


    } catch (error) {
        console.error('Error starting bot:', error);
    }
}


async function activateFunctions(bot) {
    await scheduleMessage(bot, 'clan', 'уведомление о дсе', 1)
    await scheduleMessage(bot, 'global', 'набор в клан', 15)
    await scheduleMessage(bot, 'local', 'реморис лох', 11)
}

startBot();
