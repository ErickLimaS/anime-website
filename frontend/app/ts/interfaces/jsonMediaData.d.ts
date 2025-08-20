export interface MediaOnJSONFile {
  title: string;
  description: ""; // undefined
  thumbnail: string;
  coverImage: {
    extraLarge: string; // undefined
    large: string; // undefined
  };
  picture: string;
  thumbnail?: string;
  tags: strings[];
  animeSeason: {
    season: string;
    year: number;
  };
  format: string;
  type: "TV" | "MOVIE" | "OVA" | "ONA" | "SPECIAL" | "UNKNOWN";
  status: string;
  sources: string[];
  id: number;
  episodes: number;
  duration: {
    value: number;
    unit: string;
  } | null;
  anilistId: string;
  relatedAnime: string[];
  isFavourite: false;
  mediaListEntry: null;
  anilistId?: string;
}
