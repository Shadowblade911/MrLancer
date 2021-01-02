const { isValidUrl } = require("../utils/isValidUrl.js");
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser }  = require("../utils/paramParser.js");
var _ = require('lodash');

const config = require("../config.json");


const axios = require('axios').default;


const sheetId = config.SIGN_UP_RESPONSES_ID;
const sheetRange = encodeURIComponent(config.SIGN_UP_RESPONSES_RANGE)

const recommendedFicsSheet = `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}`;

const linkToSheetSource = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`


const relayUser = (user) => {
    return `Ah, yes, ${user.name} is one of my favorite writers. You can find their works at ${user.primaryUrl}` + (user.secondaryUrl === undefined ? '' :
        ` or at ${user.secondaryUrl}`
    );
}


const convertSheet = (sheetRow) => {
    
    return {
        name: sheetRow[0],
        primaryUrl: sheetRow[1],
        secondaryURL: sheetRow[2],
    }
}


async function fetchAuthor(message, requestInfo) {


    if(requestInfo[0] === 'list'){
        if(requestInfo.length !== 1){
            generateErrorReply(message, `I don't understand what else you are asking. List is a basic command. Did you just mean \`list\`?`);
            return;
        }

        message.reply(`here you go, ${linkToSheetSource}`);
        return;
    }

    if(requestInfo.length > 1 || requestInfo.length === 0){
        generateErrorReply(message, `I'm unsure of what you're asking of me. Please quesry users by simply asking for their name. Like so 'search \`[name]\`'`);
    }

    let authorName = requestInfo[0];
    if (/^`(.+)`$/.test(authorName)) {
        authorName = authorName.replace(/^`(.+)`$/, '$1');
    }
    
    try {
        const { data } = await axios({
            method: 'get',
            url: recommendedFicsSheet,
            params: {
                key: config.SHEET_API_KEY
            },
        })

        const users = data.values.filter(userRow => isValidUrl(userRow[1])).map(userRow => convertSheet(userRow));
      
        if(requestInfo.length === 0){
            replyWithFic(message, 'Something appears to be wrong and I could not find any users, check the sheet via `author search list` and ensure people have signed up!');
            return;
        }

        let filteredUsers = _.filter(users, user => user.name === authorName);

        if(filteredUsers.length === 1){
            message.reply(relayUser(filteredUsers[0]));
        } else if(filteredUsers.length > 1){
            generateErrorReply(message, `I found more than one writer with that name! That shouldn't have happend!`);
        } else {
            generateErrorReply(message, `I couldn't find a user with that name!`);
        }

    } catch(err) {
        console.error(err);
        generateErrorReply(message, `Something went wrong!`);
    };
}



module.exports = {
    fetchAuthor
}