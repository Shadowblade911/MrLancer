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

// These are the prefixes that the bot is going to respond to. 
// I kept mistyping MrLancer which is why MrLance is on this...
const prefixes = ["!mrlancer", "!lancer", "!mrlance", "!oldman", "!mrl"];


// Enums for commands. These are what the bots is capable of responding to
const commands = {
    rec: 'rec',
    fetch: 'fetch',
    help: 'help',
    author: 'author',
    search: 'search',
    suggest: 'suggest',
    prompt: 'prompt'
};


const helpText1 = [
    "Greetings, I'm MrLancer, as you have probably guessed by calling the help command. ",
    "I respond to !MrLancer or !MrL if you want to be brief ",
    "My job, other than being an English teacher, is to help record, track, and suggest fiction sources, authors and prompts for writers. "
].join('\n');

const helpText2 = [
    "To recommend a fic, begin with `!MrLancer rec` and follow it with the name of the fic, and any other options that would apply.",
    "For example: ",
    "```!MrLancer rec `Talent Night` https://archiveofourown.org/works/26225452/chapters/63828814 complete no genre humor shipping multi-chapter pairings Danny/Ember``` ",
    "Would recommend the fic Talent Night at the given url, mark it as incomplete, that it's genre's include shipping and humor, is a multi chapter fic, and it's pairings include Danny and Ember ",
    "Another example would be... ",
    "```!MrLancer rec `Just Fourteen` https://www.fanfiction.net/s/13680095/1/Just-Fourteen complete no genre angst world-building hurt-comfort multi-chapter``` ",
    "and as a third example... ",
    "```!MrLancer rec `Eidolon Interloper` https://archiveofourown.org/works/24452716/chapters/59008513 complete no genre x-over``` ",
    "The minimum is that you must name the fic, and give the URL so that I can figure out how to group the fic reccomendations. Note the use of the back tick to contain spaces in titles. ",
    "the search command. `!MrLancer search` will return a fiction that matches the parameters given. No parameters results in a random fic from the list. ",
    "Meanwhile... ",
    " ```!MrLancer search genre angst``` ",
    "Returns a random angst ridden fic, as recommended by users such as yourself. ",
    "```!MrLancer search name \`Smells Like Team Spirit\` ```",
    "Will return a fic with the given name if it has been recommended.",
].join('\n');

const helpText3 = [
    "`!MrLancer author` is used to sign up an an author as a prestigious member of our lists.",
    "You use it like so...",
    "```!MrLancer author `sign up` HeroineofTime https://archiveofourown.org/users/HeroineofTime/ ```",
    "If you cross post to two sites, include the second url as a second parameter.",
    "```!MrLancer author search Hazama_d20 ```",
    "Will return your searched author if he has signed up.",
    "```!MrLancer suggest Vlad gets a clue```",
    "Will put the suggestion into a prompt list.",
    "```!MrLancer prompt``` will return a random prompt from the list."    
].join("\n");



// this is how we start listening to a message
client.on("message", function (message) {
    // if the message is from another bot, ignore this
    if (message.author.bot) return;
    //if the message is NOT prefixed with a prefix we care about, ignore it
    if (!_.some(prefixes, prefix => message.content.toLocaleLowerCase().startsWith(prefix))) {
        return;
    }

    // split arguments. Any space not between two ` is skipped. 
    const strings = message.content.split(/ (?=(?:[^\`]*\`[^\`]*\`)*[^\`]*$)/);

    //removes prefix from the strings array
    strings.shift();

    // if no arguements were passed, be done. 
    if(strings.length === 0){
        return;
    }

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
            message.reply(helpText1);
            message.channel.send(helpText2);
            message.channel.send(helpText3);
            return;
        case commands.fetch:
            // I have to include some jokes for my own sanity. 
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