export function convertToUnix(days: number) {

    if (days > 1) {
        const timestamp = Date.parse(new Date(Date.now() - days * 24 * 60 * 60 * 1000) as any) / 1000;

        return timestamp
    }

    const timestamp = Date.parse(new Date(Date.now()) as any) / 1000;

    return timestamp
}

export function convertFromUnix(days: number) {

    // if (days > 1) {
    //     const timestamp = Date.parse(new Date(Date.now() - days * 24 * 60 * 60 * 1000) as any) / 1000;

    //     return timestamp
    // }

    // const timestamp = Date.parse(new Date(Date.now()) as any) / 1000;

    // return timestamp
}