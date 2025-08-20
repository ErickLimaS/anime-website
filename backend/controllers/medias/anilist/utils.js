function getDateInUnixTimestamp({ daysAgo, startWithTheFirstHour }) {

    // daysAgo == 0 means today
    const date = new Date(
        Date.UTC(
            new Date().getFullYear(),
            new Date().getMonth(),
            daysAgo == 0 ? new Date().getDate() :
                new Date().getDate() - daysAgo,
            startWithTheFirstHour ? 0 : 23,
            startWithTheFirstHour ? 1 : 59,
            startWithTheFirstHour ? 0 : 59
        )
    );

    const dateInUnix = Math.floor(date.getTime() / 1000);

    return dateInUnix;
}

module.exports = {
    getDateInUnixTimestamp
}