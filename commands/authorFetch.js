const { isValidUrl } = require("../utils/isValidUrl.js");
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser }  = require("../utils/paramParser.js");
var _ = require('lodash');

const config = require("../config.json");


const axios = require('axios').default;

// getting data from config
const sheetId = config.SIGN_UP_RESPONSES_ID;
const sheetRange = encodeURIComponent(config.SIGN_UP_RESPONSES_RANGE)

const recommendedFicsSheet = `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}`;

const linkToSheetSource = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`

// formatted response to reply with based off a user
const relayUser = (user) => {
    return `Ah, yes, ${user.name} is one of my favorite writers. You can find their works at ${user.primaryUrl}` + (user.secondaryUrl === undefined ? '' :
        ` or at ${user.secondaryUrl}`
    );
}

// helper function turning an array into an object
// I should probably remove this, because this is extra work that it's doing
// but working with objects is better for my sanity
const convertSheet = (sheetRow) => {
    return {
        name: sheetRow[0],
        primaryUrl: sheetRow[1],
        secondaryURL: sheetRow[2],
    }
}


async function fetchAuthor(message, requestInfo) {
    // function that returns the google sheet that the data is stored in.
    if(requestInfo[0] === 'list'){
        if(requestInfo.length !== 1){
            generateErrorReply(message, `I don't understand what else you are asking. List is a basic command. Did you just mean \`list\`?`);
            return;
        }

        message.reply(`here you go, ${linkToSheetSource}`);
        return;
    }

    // check for malformed commands / unknown input
    if(requestInfo.length > 1 || requestInfo.length === 0){
        generateErrorReply(message, `I'm unsure of what you're asking of me. Please query users by simply asking for their name. Like so 'search \`[name]\`'`);
    }

    // get the author request out of the info and remove `'s in case the author has a space in the name
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

        // get all valid users 
        const users = data.values.filter(userRow => isValidUrl(userRow[1])).map(userRow => convertSheet(userRow));
        
        // generate error if there's no response
        if(requestInfo.length === 0){
            replyWithFic(message, 'Something appears to be wrong and I could not find any user. Check the sheet via `author search list` and ensure people have signed up!');
            return;
        }

        // find the user
        let filteredUsers = _.filter(users, user => user.name === authorName);

        // handle success and error states (1 found, more than 1 found, none found)
        if(filteredUsers.length === 1){
            message.reply(relayUser(filteredUsers[0]));
        } else if(filteredUsers.length > 1){
            generateErrorReply(message, `I found more than one writer with that name! That shouldn't have happened!`);
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