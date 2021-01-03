const { isValidUrl } = require("../utils/isValidUrl.js");
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser }  = require("../utils/paramParser.js");
const { internalKeysToExternal }  = require("../utils/genreHandlers.js");
var _ = require('lodash');

const config = require("../config.json");


const axios = require('axios').default;

// these values are from the google form that this posts to
const questionEntryValues = {
    name: "entry.391009906",
    link: "entry.350544137",
    pairings: "entry.387670591",
    user: "entry.656769464", 
    completed: "entry.1731544498",
    oneShot: "entry.2068072902",
    genre: 'entry.1799029869'
 }


const reccomendationForm = `https://docs.google.com/forms/d/e/${config.REC_FORM_ID}/formResponse`;



function handleReccomendation(message, requestInfo) {
    if (requestInfo.length < 2) {
        generateErrorReply(message, 'You have to tell me the name! Please format it like so: \`[name]\` [url]');
    }

    let title = requestInfo.shift();
    const location = requestInfo.shift();


    if (/^`(.+)`$/.test(title)) {
        title = title.replace(/^`(.+)`$/, '$1');
    }

    if (!isValidUrl(location)) {
        message.reply(location);
        generateErrorReply(message, 'You have to give me a valid url! Please format it like so: \`[name] \` [url]')
        return;
    }

    var params = new URLSearchParams();
    params.append(questionEntryValues.name, title);
    params.append(questionEntryValues.link, location);
    params.append(questionEntryValues.user, message.member.user.username);

    // parse optional values and push into the responses
    let options = {};
    try {
        options = paramParser(requestInfo);
        options.genre = _.map(options.genre, genre => internalKeysToExternal[genre]);
    } catch(err){
        generateErrorReply(message, err.message);
        return;
    }
    Object.keys(options).forEach(opt => {
        const value = options[opt];
        // this handles check box inputs
        if(_.isArray(value)){
            _.forEach(value, val => {
                params.append(questionEntryValues[opt], val);
            })
        } else {
            params.append(questionEntryValues[opt], value);
        }
    });

   

    axios({
        method: 'post',
        url: reccomendationForm,
        params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }).then(res => {
        message.reply(`I got your reccomendation for ${title} found at ${location}`);
    }).catch(err => {
        console.error(err);
        generateErrorReply(message, `Something went wrong!`);
    });

}


module.exports = {
    reccomend: handleReccomendation
}