

const { getBookTitle } = require("./bookList.js");

function generateErrorReply(message, errorMessage) {
    return message.reply(`${getBookTitle()}! ${errorMessage}`);
}


module.exports = {
    generateErrorReply: generateErrorReply
}