const { isValidUrl } = require("../utils/isValidUrl.js");
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser }  = require("../utils/paramParser.js");
var _ = require('lodash');

const config = require("../config.json");


const axios = require('axios').default;


const sheetId = config.PROMPT_RESPONSES_ID;
const sheetRange = encodeURIComponent(config.PROMPT_RESPONSES_RANGE)

const promptSheet = `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}`;

const linkToSheetSource = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`

// code to turn a prompt into a response
const relayPrompt = (prompt) => {

    let preface = `May I Suggest?`;
    if(Math.floor(Math.random * 1000) <= 1){
        preface = `I gotchu fam.`
    }

    return `${preface} \n \`\`\`${prompt}\`\`\` \n No need to thank me.`;
}


async function fetchPrompt(message, requestInfo) {

    // message to handle retrieving the list of prompts from the source
    if(requestInfo && requestInfo[0] === 'list'){
        if(requestInfo.length !== 1){
            generateErrorReply(message, `I don't understand what else you are asking. List is a basic command. Did you just mean \`list\`?`);
            return;
        }

        message.reply(`here you go, ${linkToSheetSource}`);
        return;
    }

    if(requestInfo && requestInfo.length > 0){
        generateErrorReply(message, `I'm unsure of what you're asking of me. This is a basic command`);
        return;
    }

  
    try {
        const { data } = await axios({
            method: 'get',
            url: promptSheet,
            params: {
                key: config.SHEET_API_KEY
            },
        })

        const prompts = data.values.filter(row => row[0] !== undefined).map(row => row[0]);
      
        if(prompts.length === 0){
            message.reply(message, 'Something appears to be wrong and I could not find any prompts, check the sheet via `prompt list` and ensure people have suggested prompts!');
            return;
        }

        const index = Math.floor(Math.random() * prompts.length);

        message.reply(relayPrompt(prompts[index]));

    } catch(err) {
        console.error(err);
        generateErrorReply(message, `Something went wrong!`);
    };
}



module.exports = {
    fetchPrompt
}