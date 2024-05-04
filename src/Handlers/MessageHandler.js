const {handleTeleportRequest} = require("../utils/AutoTpaccept");
const {handleMathChallenge} = require("../utils/MathChalleng");
const {parseMessage} = require("../utils/parse");
const {getQueueInstance} = require("../messageQueueSingleton");


const responsePatternsInvite = [
    /уже состоит в клане/i,
    /принял предложение/i,
    /отклонил/i,
    /пригласил/i,
    /принял предложение/i,
];


async function processChatMessage(bot, jsonMsg) {
    const messageText = jsonMsg.toString();
    await handleTeleportRequest(bot, messageText);
    handleMathChallenge(bot, messageText);

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
        } else if (message.toLowerCase().includes('sendinvite') && nick === process.env.NICK_OWNER) {
            bot.sendInvite = !!bot.sendInvite;
            bot.sendMessage(type, `${bot.sendInvite}`)
        }

        await isSendInvite(bot, type, nick, message);


    } catch (error) {
        console.error("Error processing message:", error);
    }
}


module.exports = {processChatMessage};
