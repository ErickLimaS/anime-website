import { MediaInfo } from "./apiAnilistDataInterface";

export interface MediaOnJSONFile {
  title: MediaInfo["title"];
  description: "";
  thumbnail: string;
  coverImage: {
    extraLarge: string;
    large: string;
  };
  picture: string;
  tags: strings[];
  animeSeason: {
    season: string;
    year: number;
  };
  format: MediaInfo["format"];
  type: MediaInfo["format"];
  status: string;
  sources: string[];
  id: number;
  episodes: 0;
  anilistId: string;
  isFavourite: false;
  mediaListEntry: null;
  anilistId?: string;
}
