export interface MediaInfoFetchedAnimeWatch {
  animes: AniwatchMediaData[];
}

export interface AniwatchMediaData {
  id: string;
  name: string;
  poster: string;
  duration: string;
  type: string;
  rating: number | null;
  episodes: {
    episodes: unknown;
    sub: number;
    dub: number;
  };
}

export interface MediaInfoAniwatchSuggestions {
  //curr not used
  id: string;
  name: string;
  jname: string;
  poster: string;
  moreInfo: string[];
}

export interface EpisodeLinksAnimeWatch {
  tracks: [
    {
      file: string;
      label: string;
      kind: string;
      default: boolean;
    },
  ];
  intro: {
    start: number;
    end: number;
  };
  outro: {
    start: number;
    end: number;
  };
  sources: {
    url: string;
    type: string;
  }[];
}

export interface EpisodesFetchedAnimeWatch {
  episodesDub: number;
  episodesSub: number;
  totalEpisodes: number;
  episodes: EpisodeAnimeWatch[];
}

export interface EpisodeAnimeWatch {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
}
