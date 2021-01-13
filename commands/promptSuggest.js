const { isValidUrl } = require("../utils/isValidUrl.js");
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser }  = require("../utils/paramParser.js");
var _ = require('lodash');

const config = require("../config.json");


const axios = require('axios').default;

const questionEntryValues = {
    prompt: 'entry.299662946',
}


const suggestionForm = `https://docs.google.com/forms/d/e/${config.PROMPT_FORM_ID}/formResponse`;



function promptSuggestion(message, requestInfo) {
    if (requestInfo.length == 0) {
        generateErrorReply(message, 'You have to tell a suggestion!');
    }

    
    var params = new URLSearchParams();

    let prompt = requestInfo.join(' ');
    params.append(questionEntryValues.prompt, prompt);


    axios({
        method: 'post',
        url: suggestionForm,
        params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }).then(res => {
        message.reply(`Excellent! I've added the suggestions to the list.`);
    }).catch(err => {
        console.error(err);
        generateErrorReply(message, `Something went wrong!`);
    });

}


module.exports = {
    promptSuggestion
}