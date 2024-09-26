interface UserAnilist {
  isUserFromAnilist?: boolean;
  id: number;
  name: string;
  createdAt: number;
  avatar: {
    large: string;
    medium: string;
  };
  favourites: {
    anime: {
      nodes: {
        id: number;
        title: {
          romaji: string;
        };
        format: string;
        description: string;
        coverImage: {
          extraLarge: string;
          large: string;
        };
      }[];
    };
    manga: {
      nodes: {
        id: number;
        title: {
          romaji: string;
        };
        format: string;
        description: string;
        coverImage: {
          extraLarge: string;
          large: string;
        };
      }[];
    };
  };
  options: {
    displayAdultContent: boolean;
    titleLanguage: string;
  };
}
