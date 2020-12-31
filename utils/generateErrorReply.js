

const { bookTitles } = require("./bookList.js");

function generateErrorReply(message, errorMessage) {
    const index = Math.floor(Math.random() * bookTitles.length);
    return message.reply(`${bookTitles[index]}! ${errorMessage}`);
}


module.exports = {
    generateErrorReply: generateErrorReply
}