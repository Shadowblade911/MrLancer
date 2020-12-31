const Discord = require("discord.js");
const config = require("./config.json");

const { generateErrorReply } = require("./utils/generateErrorReply.js");

const { reccomend } = require('./commands/recommend.js');

const { fetch } = require('./commands/fetch.js');

const client = new Discord.Client();

client.login(config.BOT_TOKEN);
const prefix = "!MrLancer";


let recommendationSheet = '';

let authorForm = '';


const commands = {
    rec: 'rec',
    request: 'request',
};

// Function Body
client.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const strings = message.content.split(/ (?=(?:[^\`]*\`[^\`]*\`)*[^\`]*$)/);

    //removes prefix
    const prefixValue = strings.shift();

    //gets the command
    const command = strings.shift();


    switch(command){
        case commands.rec:
            reccomend(message, strings);
            return;
        case commands.request:
            fetch(message, strings);
            return;
        default: 
           (generateErrorReply(message, `I don't understand you! I just know how to handle ${Object.keys(commands).join(', ')}`));
            return;
    }

});