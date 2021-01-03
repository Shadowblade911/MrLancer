const { isValidUrl } = require("../utils/isValidUrl.js");
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser }  = require("../utils/paramParser.js");
var _ = require('lodash');

const config = require("../config.json");


const axios = require('axios').default;

// These are mappings found by posting a google form response and checking the post results

const questionEntryValues = {
    name: 'entry.1236049569',
    primaryUrl: 'entry.442202316',
    secondaryUrl: 'entry.608875387',
 }


const authorForm = `https://docs.google.com/forms/d/e/${config.SIGN_UP_FORM_ID}/formResponse`;



function authorSignUp(message, requestInfo) {
    // minum values check
    if (requestInfo.length < 2) {
        generateErrorReply(message, 'You have to tell a name and location to find your works! Please format it like so: \`[name]\` [url] [url]');
    }

    
    var params = new URLSearchParams();

    let name = requestInfo.shift();
    const url = requestInfo.shift();
    let secondaryUrl;
    if(requestInfo.length){
        secondaryUrl = requestInfo.shift();
    }

    if (/^`(.+)`$/.test(name)) {
        name = name.replace(/^`(.+)`$/, '$1');
    }
    params.append(questionEntryValues.name, name);

    if (!isValidUrl(url)) {
        generateErrorReply(message, 'You have to give me a valid url! Please format it like so: \`[name] \` [url] [url]')
        return;
    } 
    params.append(questionEntryValues.primaryUrl, url);

    if(secondaryUrl){
        if(!isValidUrl(secondaryUrl)){
            generateErrorReply(message, 'You have to give me a valid url! Please format it like so: \`[name] \` [url] [url]');
        }
        params.append(questionEntryValues.secondaryUrl, secondaryUrl);
    }
   

    axios({
        method: 'post',
        url: authorForm,
        params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }).then(res => {
        message.reply(`Excellent! I've added ${name} to the list at ${url}` + (secondaryUrl === undefined ? `` : ` and ${secondaryUrl}`));
    }).catch(err => {
        console.error(err);
        generateErrorReply(message, `Something went wrong!`);
    });

}


module.exports = {
    authorSignUp
}