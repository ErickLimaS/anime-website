// receive a number of days and returns the unix timestamp 
export function convertToUnix(days: number) {

    if (days > 1) {
        const timestamp = Date.parse(new Date(Date.now() - days * 24 * 60 * 60 * 1000) as any) / 1000;

        return timestamp
    }

    // if days is 1 is meant to be as today
    const timestamp = Date.parse(new Date(Date.now()) as any) / 1000;

    return timestamp
}

// get last minutes and seconds of this day (today) and returns the unix timestamp
export function lastHourOfTheDay(days: number){

    const date = new Date(
        Date.UTC(
            new Date().getFullYear(),
            new Date().getMonth(),
            days == 1 ? new Date().getDate() : new Date().getDate() - days,
            26,
            59,
            59
        )
    );

    return Math.floor(date.getTime() / 1000)

}