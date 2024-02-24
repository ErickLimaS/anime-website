export function stringToUrlFriendly(text: string) {
    
    return text.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()

}