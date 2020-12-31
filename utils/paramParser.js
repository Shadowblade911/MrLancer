const _ = require('lodash');

const { validGenres, internalKeysToExternal, } = require('./genreHandlers.js');

const validTypes = {
    NAME: 'name',
    GENRE: 'genre',
    COMPLETE: 'complete',
    ONE_SHOT: 'one-shot',
    MULTI_CHAPTER: 'multichapter',
    PAIRINGS: 'pairings',
}


const genreValues = Object.values(validGenres);

const typeKeys = Object.values(validTypes);

const yankParams = (options, validationFunc) => {
    let shouldContinue = true;
   
    params = [];
    while(shouldContinue && options.length !== 0){
        if(typeKeys.indexOf(options[0].toLowerCase()) === -1){
            const nextOption = options.shift().toLowerCase();
            if(!validationFunc || validationFunc(nextOption)){
                params.push(nextOption);
            } else {
                throw new Error(`Unable to validate ${nextOption}`)
            }
        } else {
            shouldContinue = false;
        }
    }

    return params;
}

const isValidGenre = (option) => {
    return genreValues.indexOf(option) !== -1;
}


const paramParser = (options) => {
    const ret = {};
    while(options.length){
        let arg = options.shift().toLowerCase();
        switch(arg){
            case validTypes.NAME:
                if(options[0] === undefined || _.indexOf(typeKeys, options[0]) !== -1){
                    throw new Error(`I require a value for a name`);
                }
                ret.name = options.shift().replace(/^`(.+)`$/, '$1');
                break;
            case validTypes.GENRE:
                ret.genre = yankParams(options, isValidGenre);
                break;
            case validTypes.COMPLETE:
                response = options.shift();
                ret.completed = response[0].toUpperCase() + response.slice(1, response.length).toLowerCase();
                break;
            case validTypes.ONE_SHOT:
                ret.oneShot = 'One-shot';
                break;
            case validTypes.MULTI_CHAPTER:
                ret.oneShot = 'Multi-chapter';
                break;
            case validTypes.PAIRINGS:
                ret.pairings = yankParams(options);
                break;
            default:
                throw new Error(`Unkown arguement: ${arg}`);
        }
    }

    return ret;
}

module.exports = {
    paramParser
}