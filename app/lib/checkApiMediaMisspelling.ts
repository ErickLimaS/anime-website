// Made for MISTAKES of ANILIST API with title spelling.

// It converts the wrong name to the correct one, or to the one that gets the correct result.

export function checkAnilistTitleMisspelling(mediaTitle: string) {
  const animesList = [
    { wrongName: "NARUTO: Shippuuden", correctName: "NARUTO: Shippuden" },
    { wrongName: "JUJUTSU KAISEN", correctName: "JUJUTSU KAISEN (TV)" },
  ];

  const hasCorrectName = animesList.find(
    (item) => item.wrongName.toLowerCase() == mediaTitle.toLowerCase()
  );

  return hasCorrectName?.correctName || mediaTitle;
}
