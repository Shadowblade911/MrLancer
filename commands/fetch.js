const _ = require('lodash');
const { isValidUrl } = require('../utils/isValidUrl');
const { generateErrorReply } = require("../utils/generateErrorReply.js");
const { paramParser } = require("../utils/paramParser");

const { validGenres, internalKeysToExternal } = require('../utils/genreHandlers.js');

const config = require("../config.json");


const axios = require('axios').default;


const sheetId = config.REC_RESPONSES_ID;
const sheetRange = encodeURIComponent(config.REC_RESPONSE_RANGE)

const recommendedFicsSheet = `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}`;

const linkToSheetSource = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`

// formatted response of a fic
const relayFic = (fic) => {
    return `\n ${fic.name} \n ${fic.url} \n Recommended  by: ${fic.reccedBy} \n genres: ${listGenres(fic)}`;
}

// take an array of fics and returns one, or an error message
// if there are multiple, it slightly weights in favor of ones whos have been recced multiple times. 
const replyWithFic = (message, ficsArr) => {
    if(ficsArr.length === 0){
        message.reply("Sorry! I didn't find any listed with those requirements!");
    } else if(ficsArr.length === 1){ 
        message.reply(`Found one recommended fic! ${relayFic(ficsArr[0])}`);
    } else {
        const weightedFics = [];
        ficsArr.forEach(fic => {
            for(let i = 0; i < fic.recCount; i++){
                weightedFics.push(fic);
            }
        });

        index = Math.floor(Math.random() * weightedFics.length);

         
        message.reply(`I found multiple options. Here's one from the list! ${relayFic(weightedFics[index])}`);
    }
    return;
}

// helper function. This converts the an array into an object
const convertSheet = (sheetRow) => {
    
    return {
        name: sheetRow[0],
        url: sheetRow[1],
        recCount: sheetRow[2],
        reccedBy: sheetRow[3],
        genres: {
            [validGenres.ANGST]: !!sheetRow[4],
            [validGenres.AU]: !!sheetRow[5],
            [validGenres.X_OVER]: !!sheetRow[6],
            [validGenres.DARK]: !!sheetRow[7],
            [validGenres.FIX_FIC]: !!sheetRow[8],
            [validGenres.FLUFF]: !!sheetRow[9],
            [validGenres.HURT_COMFORT]: !!sheetRow[10],
            [validGenres.HURT_NO_COMFORT]: !!sheetRow[11],
            [validGenres.SHIPPING]: !!sheetRow[12],
            [validGenres.HUMOR]: !!sheetRow[13],
            [validGenres.REVEAL]: !!sheetRow[14],
            [validGenres.WORLD_BUILDING]: !!sheetRow[15],
            [validGenres.DRAMA]: !!sheetRow[16],
        },
        isCompleted: sheetRow[17],
        isMultiChapterOrOneShot: sheetRow[18],
        pairings: sheetRow[19],
    }
}

// code to list genre's associated with a fic
const listGenres = (fic) => {
    ret = [];
    Object.keys(fic.genres).forEach(key => {
        if(fic.genres[key]){
            ret.push(internalKeysToExternal[key]);
        }
    });

    return ret.join(', ')
}

async function fetch(message, requestInfo) {
   
    // handle command to get the list directly
    if(requestInfo[0] === 'list'){
        if(requestInfo.length > 1){
            generateErrorReply(message, `I don't understand what else you are asking. List is a basic command. Did you just mean \`list\`?`);
            return;
        }
        message.reply(`here you go, ${linkToSheetSource}`);
        return;
    }
    
    try {
        const { data } = await axios({
            method: 'get',
            url: recommendedFicsSheet,
            params: {
                key: config.SHEET_API_KEY
            },
        })

         const fics = data.values.filter(ficRow => isValidUrl(ficRow[1])).map(ficRow => convertSheet(ficRow));
      
         // if no fics are found, respond appropriately
        if(requestInfo.length === 0){
            replyWithFic(message, fics);
            return;
        }


        // get options passed in as arguments
        let options = {};
        try {
            options = paramParser(requestInfo);
        } catch (err) {
            generateErrorReply(message, err.message);
            return;
        }

        // begin filtering the list
        let matches = fics;

        if(options.completed){
            matches = matches.filter(fic => fic.isCompleted === options.completed);   
        }

        if(options.genre){
            matches = matches.filter(fic => _.every(options.genre, (opt => fic.genres[opt])));   
        }

        if(options.oneShot){
            matches = matches.filter(fic => fic.isMultiChapterOrOneShot === options.oneShot);   
        }

        if(options.pairings){
            matches = matches.filter(fic => (fic.parings && fic.pairings.includes(options.pairings)));
        }

        if(options.name){
            const exactMatches = matches.filter(fic => fic.name === options.name);
            if(exactMatches.length === 1){
                replyWithFic(message, exactMatches);
                return;
            } else {
                matches = exactMatches;
            }
        }

        // return the fic
        replyWithFic(message, matches);


    } catch(err) {
        console.error(err);
        generateErrorReply(message, `Something went wrong!`);
    };

}


module.exports = {
    fetch: fetch
}