var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/i; // fragment locator

function isValidUrl(str) {
    return !!pattern.test(str);
}


module.exports = {
    isValidUrl: isValidUrl
}