import { SourceType } from "@/app/ts/interfaces/episodesSource";

export const sourcesAvailable: {
  name: string;
  value: SourceType["source"];
  isAvailable: boolean;
}[] = [
  { name: "Crunchyroll", value: "crunchyroll", isAvailable: false }, // initiates as false
  { name: "GoGoAnime", value: "gogoanime", isAvailable: false },
  { name: "Zoro", value: "zoro", isAvailable: false },
  { name: "Aniwatch", value: "aniwatch", isAvailable: false },
];
