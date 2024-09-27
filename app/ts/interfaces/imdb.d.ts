export interface ImdbSearchItem {
  id: number;
  title: string;
  image: string;
  type: string;
  rating: number;
  releaseDate: string;
}

export interface ImdbMediaInfo {
  rating: number;
  id: string;
  title: string;
  type: string;
  image: string;
  cover: string;
  logos: {
    url: string;
    aspectRatio: number;
    width: number;
  }[];
  seasons: {
    season: number;
    image: {
      hd: string;
      mobile: string;
    };
    episodes: ImdbEpisode[];
  }[];
}

export interface ImdbEpisode {
  id: string;
  title: string;
  episode: number;
  season: number;
  releaseDate: string;
  description: string;
  url: string;
  img: {
    hd: string;
    mobile: string;
  };
}
