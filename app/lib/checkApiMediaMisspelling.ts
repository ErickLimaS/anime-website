// made for many MISTAKES of API with spelling.
// It converts the wrong name that i got to the correct one,
//  or to the one that gets the correct result.
export function checkApiMisspellingMedias(mediaTitle: string) {

    const animesList = [
        { wrongNameOnApi: "NARUTO: Shippuuden", correctName: "NARUTO: Shippuden" },
        { wrongNameOnApi: "JUJUTSU KAISEN", correctName: "JUJUTSU KAISEN (TV)" }
    ]

    const hasCorrectName = animesList.find(item => item.wrongNameOnApi.toLowerCase() == mediaTitle.toLowerCase())

    return hasCorrectName?.correctName || mediaTitle

}