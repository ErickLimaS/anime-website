export default function regexOnlyAlphabetic(text: string) {

    const newText = text.replace(/[^a-zA-Z ]/g, " ")

    return newText

}