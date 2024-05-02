require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || './.env' });

module.exports = {
    host: process.env.MC_HOST,
    username: process.env.MC_USERNAME,
    password: process.env.MC_PASSWORD,
    version: process.env.MC_VERSION,
    commandPrefix: process.env.MC_COMMAND_PREFIX,
};

