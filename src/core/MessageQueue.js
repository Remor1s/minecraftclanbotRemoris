class MessageQueue {
    constructor(bot) {
        this.bot = bot;
        this.queue = [];
        this.isSending = false;
        this.responseListeners = new Map();
        this.lastSendTime = Date.now();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sendNextMessage() {
        if (this.isSending || this.queue.length === 0) return;

        const { chatType, messages, username, delay } = this.queue.shift();
        this.isSending = true;

        try {
            await this.sendMessage(chatType, messages, username, delay);
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        } finally {
            this.isSending = false;
            this.sendNextMessage();
        }
    }



    async sendMessage(chatType, messages, username, delay) {
        if (typeof messages === 'string' || typeof messages === 'number') {
            messages = [messages];
        } else if (!Array.isArray(messages)) {
            console.error('MessageQueue: Неверный тип сообщения:', messages);
            return;
        }

        if (chatType !== 'clan') {
            await this.delay(4000);
        }

        for (const message of messages) {
            console.log(`Sending message ${username} of type ${chatType}: ${message}`);

            switch (chatType) {
                case 'command':
                    await this.bot.chat(message);
                    break;
                case 'global':
                    await this.bot.chat("!" + message);
                    break;
                case 'local':
                    await this.bot.chat(message);
                    break;
                case 'private':
                    console.log(`Private message from ${username} to ${message}`);
                    await this.bot.chat(`/msg ${username} ${message}`);
                    break;
                case 'clan':
                    await this.bot.chat(`/cc ${message}`);
                    break;
                default:
                    console.log('Неизвестный тип чата:', chatType);
                    break;
            }
            await this.delay(delay);
        }
    }

    enqueueMessage(chatType, messages, username = '', baseDelay = 4000) {
        const chatDelays = {
            telegram: 50,
            local: 8000,
            global: 8000,
            clan: 300,
            command: 8000,
            private: 8000,
        };

        const delay = chatDelays[chatType] || baseDelay;
        this.queue.push({ chatType, messages, username, delay });
        console.log(`Enqueued message: ${messages}`);

        if (!this.isSending) {
            this.sendNextMessage();
        }
    }

    sendMessageAndWaitForReply(commandToSend, responsePatterns, timeout) {
        return new Promise((resolve, reject) => {
            console.log(`Отправляем команду: ${commandToSend}`);

            if (!Array.isArray(responsePatterns)) {
                responsePatterns = [responsePatterns];
            }

            const chatListener = (jsonMsg) => {
                const message = jsonMsg.toString();
                for (const pattern of responsePatterns) {
                    const match = message.match(pattern);
                    if (match) {
                        this.bot.removeListener('message', chatListener);
                        clearTimeout(timeoutId);
                        resolve(match);
                        return;
                    }
                }
            };

            this.bot.on('message', chatListener);

            const timeoutId = setTimeout(() => {
                this.bot.removeListener('message', chatListener);
                reject(new Error("Таймаут ожидания ответа"));
            }, timeout);

            this.enqueueMessage('command', commandToSend, '', timeout); // Обратите внимание, что timeout здесь не используется для задержки
        });
    }

}

module.exports = MessageQueue;
