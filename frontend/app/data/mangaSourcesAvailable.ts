export const sourcesAvailable: {
  name: string;
  value: "mangadex";
  isAvailable: boolean;
  apiOrigin: "consumet" | "aniwatch" | "anilist";
}[] = [
  {
    name: "Mangadex",
    value: "mangadex",
    isAvailable: false, // initiates as false
    apiOrigin: "consumet",
  },
];
