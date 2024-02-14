export function stringToUrlFriendly(text: string) {

    return text.replace(/[^a-z]+/i, ' ').split(" ").join("-").toLowerCase()

}