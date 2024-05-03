// messageHandlers.js
async function handleJoinMessage(bot, message) {
    const joinMatch = message.match(/\[\*\]\s+(\S+)\s+присоеденился к клану\./i);
    if (joinMatch) {
        const username = joinMatch[1];
        console.log(joinMatch);
        await handlePlayerJoinedClan(username);
    }
}

async function handleLeaveMessage(bot, message) {
    const leaveMatch = message.match(/(\S+)\s+покинул клан\./i);
    if (leaveMatch) {
        const username = leaveMatch[1];
        console.log(leaveMatch);
        await handlePlayerLeftClan(username);
    }
}

async function handleExclusionMessage(bot, message) {
    const exclusionMatch = message.match(/(\S+) был исключен из клана игроком \S+/i);
    if (exclusionMatch) {
        const username = exclusionMatch[1];
        console.log(exclusionMatch);
        await handlePlayerLeftClan(username);
    }
}

module.exports = {
    handleJoinMessage,
    handleLeaveMessage,
    handleExclusionMessage
};
