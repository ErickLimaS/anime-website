import { getMediaInfoOnIMDB } from "@/app/api/consumet/consumetImdb";
import { getAniwatchEpisodeByEpisodeId } from "@/app/api/episodes/aniwatch/episodesInfo";
import { consumetEpisodeByEpisodeId } from "@/app/api/episodes/consumet/episodesInfo";
import {
  optimizedFetchOnAniwatch,
  optimizedFetchOnGoGoAnime,
  optimizedFetchOnZoro,
} from "@/app/lib/dataFetch/optimizedFetchAnimeOptions";
import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import {
  EpisodeAnimeWatch,
  EpisodeLinksAnimeWatch,
} from "@/app/ts/interfaces/aniwatchData";
import { SourceType } from "@/app/ts/interfaces/episodesSource";
import {
  EpisodeLinksGoGoAnime,
  GogoanimeMediaEpisodes,
} from "@/app/ts/interfaces/gogoanimeData";
import { ImdbEpisode, ImdbMediaInfo } from "@/app/ts/interfaces/imdb";

export async function loadImdbMediaAndEpisodeInfo({
  mediaInfo,
  currEpisode,
}: {
  mediaInfo: MediaDataFullInfo;
  currEpisode: string;
}) {
  const imdbEpisodesList: ImdbEpisode[] = [];

  const mediaInfoFromImdb: ImdbMediaInfo | null = await getMediaInfoOnIMDB({
    search: true,
    seachTitle: mediaInfo.title.english || mediaInfo.title.romaji,
    releaseYear: mediaInfo.startDate.year,
  });

  // map episodes to one only list, getting it from all seasons
  mediaInfoFromImdb?.seasons?.map((itemA) =>
    itemA.episodes?.map((itemB) => imdbEpisodesList.push(itemB))
  );

  const currEpisodeImdbEpisode = imdbEpisodesList?.find(
    (item) => item.episode == Number(currEpisode)
  );

  return currEpisodeImdbEpisode;
}

export async function getZoroStreamingLink({
  episodeId,
  mediaInfo,
  isDubbed,
}: {
  episodeId: string;
  mediaInfo: MediaDataFullInfo;
  isDubbed: boolean;
}) {
  const episodeData: EpisodeLinksGoGoAnime | undefined | null =
    await consumetEpisodeByEpisodeId({
      episodeId,
      provider: "zoro",
    });

  if (!episodeData || !episodeData.sources) {
    throw new Error("Episode data not found on Zoro");
  }

  // Episode link source
  let episodeUrl = episodeData.sources.find(
    (item) => item.quality == "default"
  ).url;

  if (!episodeUrl) episodeUrl = episodeData.sources[0].url;

  // Episodes for this media
  const episodesList = (await optimizedFetchOnZoro({
    textToSearch: mediaInfo.title.english || mediaInfo.title.romaji,
    only: "episodes",
    isDubbed,
  })) as GogoanimeMediaEpisodes[];

  const isEpisodeFromTheSameMedia = compareEpisodeIDs({
    episodeId,
    episodesList,
    sourceName: "zoro",
  });

  return {
    episodeData,
    episodeUrl,
    episodesList,
    isEpisodeFromTheSameMedia,
  };
}

export async function getGogoanimeStreamingLink({
  episodeId,
  mediaInfo,
  isDubbed,
}: {
  episodeId: string;
  mediaInfo: MediaDataFullInfo;
  isDubbed: boolean;
}) {
  const episodeData: EpisodeLinksGoGoAnime | undefined | null =
    await consumetEpisodeByEpisodeId({
      episodeId: episodeId,
      provider: "gogoanime",
    });

  if (!episodeData || !episodeData.sources) {
    throw new Error("Episode data not found on Gogoanime");
  }

  // Episode link source
  let episodeUrl = episodeData.sources.find(
    (item) => item.quality == "default"
  ).url;
  if (!episodeUrl) episodeUrl = episodeData.sources[0].url;

  // Episodes for this media
  const episodesList: GogoanimeMediaEpisodes[] =
    (await optimizedFetchOnGoGoAnime({
      textToSearch: mediaInfo.title.english || mediaInfo.title.romaji,
      only: "episodes",
      isDubbed: isDubbed,
    })) as GogoanimeMediaEpisodes[];

  const isEpisodeFromTheSameMedia = compareEpisodeIDs({
    episodeId,
    episodesList,
    sourceName: "gogoanime",
  });

  return {
    episodeData,
    episodeUrl,
    episodesList,
    isEpisodeFromTheSameMedia,
  };
}

export async function getAniwatchStreamingLink({
  episodeId,
  mediaInfo,
  isDubbed,
}: {
  episodeId: string | undefined;
  mediaInfo: MediaDataFullInfo;
  isDubbed: boolean;
}) {
  let episodesList;

  // If url is somewhat empty, it will fetch the first episode id
  if (!episodeId) {
    episodesList = (await optimizedFetchOnAniwatch({
      textToSearch: mediaInfo.title.english || mediaInfo.title.romaji,
      only: "episodes",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((res: any) => res?.episodes)) as EpisodeAnimeWatch[];

    if (episodesList.length == 0) {
      throw new Error(
        "No search params on URL. Try again through the anime Media Page."
      );
    }

    episodeId = episodesList[0].episodeId;
  }

  // fetch episode data
  const episodeData: EpisodeLinksAnimeWatch | undefined =
    await getAniwatchEpisodeByEpisodeId({
      episodeId: episodeId,
      category: isDubbed ? "dub" : "sub",
    });

  if (!episodeData) {
    throw new Error("Episode data not found on Aniwatch");
  }

  // fetch episode link source
  const episodeUrl = episodeData.sources[0].url;

  // fetch episodes for this media, if dub option is ON, it will filter them
  if (!episodesList) {
    episodesList = (await optimizedFetchOnAniwatch({
      textToSearch: mediaInfo.title.english || mediaInfo.title.romaji,
      only: "episodes",
      format: mediaInfo.format,
      idToMatch: episodeId?.split("?")[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((res: any) =>
      isDubbed ? res?.episodes.slice(0, res.episodesDub) : res?.episodes
    )) as EpisodeAnimeWatch[];
  }

  const episodeSubtitles = episodeData.tracks;

  const isEpisodeFromTheSameMedia = compareEpisodeIDs({
    episodeId,
    episodesList,
    sourceName: "aniwatch",
  });

  return {
    episodeData,
    episodeUrl,
    episodesList,
    isEpisodeFromTheSameMedia,
    episodeSubtitles,
  };
}

function compareEpisodeIDs({
  episodeId,
  episodesList,
  sourceName,
}: {
  episodeId: string;
  episodesList: { id?: string; episodeId?: string }[];
  sourceName: Omit<SourceType["source"], "crunchyroll">;
}) {
  // Compare Episode ID from params with episodes fetched ID
  switch (sourceName) {
    case "aniwatch":
      const aniwatchEpisodeIdFromParamsIsOnEpisodesList = episodesList.find(
        (episode) => episode.episodeId == episodeId
      );

      return aniwatchEpisodeIdFromParamsIsOnEpisodesList == undefined;

    case "gogoanime":
    case "zoro":
      const gogoanimeEpisodeIdFromParamsIsOnEpisodesList = episodesList.find(
        (episode) => episode.id == episodeId
      );

      return gogoanimeEpisodeIdFromParamsIsOnEpisodesList == undefined;

    default:
      return false;
  }
}
