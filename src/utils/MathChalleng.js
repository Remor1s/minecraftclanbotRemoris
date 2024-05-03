function handleMathChallenge(bot, message) {
    const mathRegex = /Решите пример: (.+?)\. Ответ напишите в чат/;
    const match = message.match(mathRegex);

    if (match) {
        const mathProblem = match[1];
        console.log(`Math problem received: ${mathProblem}`);
        const answer = evaluateMathExpression(mathProblem);

        if (answer !== undefined) {
            console.log(`Answer: ${answer}`);
            bot.sendMessage('global', answer.toString());
        } else {
            console.log("Could not solve the math problem.");
        }
    }
}

function evaluateMathExpression(expression) {
    try {
        return eval(expression);
    } catch (error) {
        console.error(`Error evaluating math expression: ${expression}`, error);
        return undefined;
    }
}

module.exports = {
    handleMathChallenge,
}