import { MediaData } from "./anilistMediaData";

interface BookmarkItem {
  title: MediaData["title"];
  format: MediaData["format"];
  description: MediaData["description"];
  coverImage: {
    extraLarge: string;
  };
  id: MediaData["id"];
}

interface UserComment extends ReplyComment {
  likes: number;
  dislikes: number;
  fromEpisode: boolean | null;
  episodeId: string | null;
  episodeNumber: number | null;
}

interface ReplyComment {
  username: string | undefined;
  userPhoto: string | undefined;
  comment: string;
  isSpoiler: boolean;
  createdAt: number;
  replies: UserComment[];
  userId: {
    id: string;
  };
}

interface KeepWatchingMediaData {
  id: MediaData["id"];
  title: MediaData["title"];
  description: "";
  updatedAt: number;
  source: SourceType["source"];
  format: MediaData["format"];
  type: MediaData["format"];
  episodes: 0;
  episode: string;
  episodeId: string;
  episodeImg: string;
  episodeTimeLastStop: number;
  episodeDuration: number;
  dub: boolean;
  coverImage: {
    extraLarge: string;
    large: string;
  };
  isFavourite: false;
  mediaListEntry: null;
}

interface ListItemOnMediasSaved {
  id: number;
  title: MediaData["title"];
  description: string;
  format: MediaData["format"];
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
  coverImage: {
    extraLarge: string;
    large: string;
  };
}

interface NotificationsCollectionFirebase {
  mediaId: string;
  isComplete: boolean;
  nextReleaseDate: number;
  title: MediaData["title"];
  coverImage: {
    extraLarge: string;
    large: string;
  };
  episodes: {
    number: number;
    releaseDate: number | null;
    wasReleased: boolean;
  }[];
  lastUpdate: number;
  status: string | null;
}

interface UserDocAssignedNotificationsFirebase {
  mediaId: string;
  lastEpisodeNotified: number;
  status: string;
  title: MediaData["title"];
}
