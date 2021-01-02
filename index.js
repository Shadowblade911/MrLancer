const Discord = require("discord.js");
const config = require("./config.json");
const _ = require('lodash');

const { generateErrorReply } = require("./utils/generateErrorReply.js");

const { reccomend } = require('./commands/recommend.js');

const { fetch } = require('./commands/fetch.js');

const { authorSignUp } = require('./commands/authorSignUp.js');

const { fetchAuthor } = require('./commands/authorFetch.js');


const { promptSuggestion } = require('./commands/promptSuggest.js');

const { fetchPrompt } = require('./commands/promptFetch.js');

const client = new Discord.Client();

client.login(config.BOT_TOKEN);
const prefixes = ["!MrLancer", "!MrLance", "!MrL"];


const commands = {
    rec: 'rec',
    fetch: 'fetch',
    help: 'help',
    author: 'author',
    search: 'search',
    suggest: 'suggest',
    prompt: 'prompt'
};




// Function Body
client.on("message", function (message) {
    if (message.author.bot) return;
    if (!_.some(prefixes, prefix => message.content.startsWith(prefix))) {
        return;
    }

    const strings = message.content.split(/ (?=(?:[^\`]*\`[^\`]*\`)*[^\`]*$)/);

    //removes prefix
    strings.shift();

    //gets the command
    let command = strings.shift();
    command = command && command.toLocaleLowerCase();
    switch(command){
        case commands.rec:
            reccomend(message, strings);
            return;
        case commands.search:
            fetch(message, strings);
            return;
        case commands.help:
            message.reply("this should eventually become a useful help message");
            return;
        case commands.fetch:
            generateErrorReply(message, 'Stop trying to make fetch happen!');
            return;
        case commands.author: 
            let nextCommand = strings.shift();
            nextCommand = nextCommand && nextCommand.toLocaleLowerCase();
            switch(nextCommand){
                case '`sign up`':
                    authorSignUp(message, strings);
                    return;
                case 'search':
                    fetchAuthor(message, strings);
                    return;
                default:
                    generateErrorReply(message, `I do not recongize that sub command ${nextCommand}, I know \`sign up\` and search`);
                    return;
            } 
        case commands.prompt: 
            fetchPrompt(message, strings);
            return;
        case commands.suggest:
            promptSuggestion(message, strings);
            return;
        default: 
           (generateErrorReply(message, `I don't understand you! I just know how to handle ${Object.keys(commands).join(', ')}`));
            return;
    }

});