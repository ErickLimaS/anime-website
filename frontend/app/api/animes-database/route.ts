import { NextRequest, NextResponse } from "next/server";
import AnimeDataOffline from "./anime-offline-database.json";
import { MediaOnJSONFile } from "@/app/ts/interfaces/jsonMediaData";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const resultsLimit = 12;

  let dataToBeSorted: MediaOnJSONFile[] = (
    AnimeDataOffline as { data: MediaOnJSONFile[] }
  ).data;

  if (searchParams.get("type")) {
    dataToBeSorted = dataToBeSorted.filter(
      (media) => media.type == searchParams.get("type")!.toUpperCase()
    );
  }

  if (searchParams.get("year")) {
    dataToBeSorted = dataToBeSorted.filter(
      (media) => media.animeSeason.year == Number(searchParams.get("year"))
    );
  }

  if (searchParams.get("genre")) {
    dataToBeSorted = dataToBeSorted.filter((media) =>
      media.tags.some((genreName) =>
        searchParams.get("genre")!.includes(genreName)
      )
    );
  }

  if (searchParams.get("status")) {
    dataToBeSorted = dataToBeSorted.filter(
      (media) => media.status == searchParams.get("status")!.toUpperCase()
    );
  }

  if (searchParams.get("title")) {
    dataToBeSorted = dataToBeSorted.filter((media) =>
      media.title
        .toLowerCase()
        .includes(searchParams.get("title")!.toLowerCase())
    );
  }

  if (searchParams.get("season")) {
    dataToBeSorted = dataToBeSorted.filter(
      (media) =>
        media.animeSeason.season.toLocaleLowerCase() ==
        searchParams.get("season")?.toLocaleLowerCase()
    );
  }

  switch (searchParams.get("sort")) {
    case "releases_desc":
      dataToBeSorted = dataToBeSorted
        .sort((a, b) => a.animeSeason.year - b.animeSeason.year)
        .reverse();

      break;

    case "releases_asc":
      dataToBeSorted = dataToBeSorted.sort(
        (a, b) => a.animeSeason.year - b.animeSeason.year
      );

      break;

    case "title_desc":
      dataToBeSorted = dataToBeSorted.sort((a, b) =>
        a.title > b.title ? -1 : 1
      );

      break;

    case "title_asc":
      dataToBeSorted = dataToBeSorted
        .sort((a, b) => (a.title > b.title ? -1 : 1))
        .reverse();

      break;

    default:
      break;
  }

  const totalResultsLength = dataToBeSorted.length;

  // GET ANILIST ID FOR EACH MEDIA
  if (dataToBeSorted.length > 0) {
    const mediasWithAnilistId = dataToBeSorted
      .filter((media) =>
        media.sources.map((source) => {
          if (source.includes("https://anilist.co/anime")) {
            const urlWithAnilistId = source.slice(source.search(/\banime\b/));

            media.anilistId = urlWithAnilistId!.slice(6);
          }
        })
      )
      .filter((item) => item.anilistId);

    dataToBeSorted = mediasWithAnilistId;
  }

  const resultsLimitedByPage = dataToBeSorted.slice(
    0,
    resultsLimit * Number(searchParams.get("page") || 1)
  );

  return NextResponse.json(
    {
      data: resultsLimitedByPage,
      allResultsLength: totalResultsLength,
      lastUpdate: (AnimeDataOffline as { lastUpdate: string }).lastUpdate,
    },
    {
      status: 200,
    }
  );
}
