// function to convert time from hh:mm:ss format to sec
const timeConverter = (timeInHMS) => {

    // split at colons
    let formattedTime = timeInHMS.split(':');
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let timeInSeconds = (+formattedTime[0]) * 60 * 60 + (+formattedTime[1]) * 60 + (+formattedTime[2]);

    return timeInSeconds
}

module.exports = {
    timeConverter
}