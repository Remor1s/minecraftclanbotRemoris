const MessageQueue = require('./core/MessageQueue');
let messageQueue = null;

function initializeMessageQueue(bot) {
    if (!messageQueue) {
        messageQueue = new MessageQueue(bot);
    }
    return messageQueue;
}

function getQueueInstance() {
    if (!messageQueue) {
        throw new Error("MessageQueue has not been initialized. Call initializeMessageQueue first.");
    }
    return messageQueue;
}

module.exports = { initializeMessageQueue, getQueueInstance };
