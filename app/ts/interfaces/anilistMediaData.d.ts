export interface MediaData {
  title: {
    romaji: string;
    native: string;
    english: string;
    userPreferred: string;
  };
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  nextAiringEpisode: {
    airingAt: number;
    episode: number;
  };
  status: string | null;
  description: string;
  episodes: number;
  duration: number;
  season: string;
  seasonYear: number;
  isAdult: boolean;
  id: number;
  isFavourite: boolean;
  mediaListEntry: {
    id: number;
    mediaId: number;
    status:
      | "COMPLETED"
      | "CURRENT"
      | "PLANNING"
      | "DROPPED"
      | "PAUSED"
      | "REPEATING";
    progress: number;
    media: {
      title: {
        romaji: string;
      };
    };
  };
  trailer: {
    id: string;
  };
  coverImage: {
    extraLarge: string | StaticImport;
    large: string | StaticImport;
    medium: string | StaticImport;
    color: string | StaticImport;
  };
  bannerImage: string | StaticImport;
  type: "ANIME" | "MANGA";
  format: "OVA" | "TV" | "ONA" | "SPECIAL" | "MOVIE" | "MANGA" | "MUSIC";
  genres: string[];
  trending: number;
  popularity: number;
  averageScore: number;
}

export interface AiringMediaResult {
  popularity: number;
  airingAt: number;
  episode: number;
  id: number;
  media: MediaData;
  mediaId: number;
  timeUntilAiring: number;
}

export interface TrendingMediaResult {
  date: number;
  trending: number;
  averageScore: number;
  inProgress: number;
  releasing: boolean;
  episode: number;
  popularity: number;
  media: MediaData;
  mediaId: number;
}

export interface EpisodesType {
  site: string;
  url: string;
  thumbnail: string;
  title: string;
}

export interface MediaDataFullInfo extends MediaData {
  hashtag: string;
  favourites: number;
  source: string;
  duration: number | null;
  volumes: number | null;
  chapters: number | null;
  characters: {
    edges: [
      {
        id: number;
        node: {
          image: {
            large: string;
            medium: string;
          };
          name: {
            full: string;
          };
        };
        voiceActorRoles: [
          {
            voiceActor: {
              id: number;
              image: {
                large: string;
                medium: string;
              };
              name: {
                full: string;
              };
            };
          },
        ];
      },
    ];
  };
  streamingEpisodes: EpisodesType[];
  studios: {
    edges: [
      {
        node: {
          name: string;
          id: number;
          isAnimationStudio: boolean;
          siteUrl: string;
        };
      },
    ];
  };
  relations: {
    nodes: MediaData[];
  };
  recommendations: {
    edges: [
      {
        node: {
          mediaRecommendation: MediaData;
        };
      },
    ];
  };
  reviews: {
    nodes: {
      id: number;
      summary: string;
      rating: number;
      userRating: string;
      ratingAmount: number;
      score: number;
      body: string;
      user: {
        id: number;
        name: string;
        avatar: {
          large: string;
          medium: string;
        };
        about: string;
      };
    }[];
  };
}
