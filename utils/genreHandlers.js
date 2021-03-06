//  These are the current list of handled genres. 
//  Google forms has the values as 'Angst' instead of 'angst' which is what I want to use internally
//  This is more important for 'Hurt + Comfort' which has spaces, which would confuse the parser
//  so this lets me consume the genres internally, then post them to google/search the forms using google's layout. 

const validGenres = {
    ANGST: 'angst',
    AU: 'au',
    X_OVER: 'x-over',
    DARK: 'dark',
    FIX_FIC: 'fix-fic',
    FLUFF: 'fluff',
    HURT_COMFORT: 'hurt-comfort',
    HURT_NO_COMFORT: 'hurt-no-comfort',
    SHIPPING: 'shipping',
    HUMOR: 'humor',
    REVEAL: 'reveal',
    WORLD_BUILDING: 'world-building',
    DRAMA: 'drama'
};

const internalKeysToExternal = {
    [validGenres.ANGST]: 'Angst',
    [validGenres.AU]: 'AU',
    [validGenres.X_OVER]: 'X-over',
    [validGenres.DARK]: 'Dark',
    [validGenres.FIX_FIC]: 'Fix-fic',
    [validGenres.FLUFF]: 'Fluff',
    [validGenres.HURT_COMFORT]: 'Hurt + Comfort',
    [validGenres.HURT_NO_COMFORT]: 'Hurt + No Comfort',
    [validGenres.SHIPPING]: 'Shipping',
    [validGenres.HUMOR]: 'Humor',
    [validGenres.REVEAL]: 'Reveal',
    [validGenres.WORLD_BUILDING]: 'World Building',
    [validGenres.DRAMA]: 'Drama', 
}


module.exports = {
    validGenres,
    internalKeysToExternal,
}