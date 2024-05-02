require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || './.env' });
const socks = require('socks').SocksClient;


module.exports = {
    host: process.env.MC_HOST,
    username: process.env.MC_USERNAME,
    password: process.env.MC_PASSWORD,
    version: process.env.MC_VERSION,
    commandPrefix: process.env.MC_COMMAND_PREFIX,
    connect: client => {
        socks.createConnection({
            proxy: {
                host: '213.166.95.188',
                port: 19431,
                type: 5,
                userId: 'user134887',
                password: 'twbxkp'
            },
            command: 'connect',
            destination: {
                host: process.env.MC_HOST, // Адрес сервера Minecraft
                port: 25565              // Порт сервера Minecraft
            }
        }, (err, info) => {
            if (err) {
                console.log('Прокси ошибка подключения:', err);
                return;
            }
            client.setSocket(info.socket);
            client.emit('connect');
        })
    }
};

