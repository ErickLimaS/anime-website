import { NextRequest, NextResponse } from "next/server";
import AnimeDataOffline from "./anime-offline-database.json";
import { MediaDbOffline } from "@/app/ts/interfaces/dbOffilineInterface";

export async function GET(request: NextRequest) {

    const params = request.nextUrl.searchParams

    const resultLimit = 12

    let dataSort = (AnimeDataOffline as { data: MediaDbOffline[] }).data

    if (params.get("type")) dataSort = dataSort.filter((item: { type: string }) => item.type == params.get("type")!.toUpperCase())

    if (params.get("genre")) dataSort = dataSort.filter((item: { tags: string[] }) => item.tags.some(a => (params.get("genre")!.includes(a))))

    if (params.get("status")) dataSort = dataSort.filter((item: { status: string }) => item.status == params.get("status")!.toUpperCase())

    if (params.get("year")) dataSort = dataSort.filter((item: { animeSeason: { year: number } }) => item.animeSeason.year == Number(params.get("year")))

    if (params.get("title")) dataSort = dataSort.filter((item: { title: string }) => item.title.toLowerCase().includes(params.get("title")!.toLowerCase()))

    if (params.get("season")) dataSort = dataSort.filter((item: { animeSeason: { season: string } }) =>
        item.animeSeason.season.toLocaleLowerCase() == params.get("season")?.toLocaleLowerCase()
    )

    if (params.get("sort")) {
        if (params.get("sort") == "releases_desc") {
            dataSort = dataSort.sort(
                (a: { animeSeason: { year: number } }, b: { animeSeason: { year: number } }) => a.animeSeason.year - b.animeSeason.year
            ).reverse()
        }
        else if (params.get("sort") == "releases_asc") {
            dataSort = dataSort.sort(
                (a: { animeSeason: { year: number } }, b: { animeSeason: { year: number } }) => a.animeSeason.year - b.animeSeason.year
            )
        }

        if (params.get("sort") == "title_desc") {
            dataSort = dataSort.sort(
                (a: { title: string }, b: { title: string }) => a.title > b.title ? -1 : 1
            )
        }
        else if (params.get("sort") == "title_asc") {
            dataSort = dataSort.sort(
                (a: { title: string }, b: { title: string }) => a.title > b.title ? -1 : 1
            ).reverse()
        }
    }

    const totalLength = dataSort.length

    // GET ANILIST ID FOR EACH MEDIA
    if (dataSort) {

        let sortHasAnilistId = dataSort.filter((item) => item.sources.map(a => {

            if (a.includes("https://anilist.co/anime")) {
                const foundUrl: string | null = a.slice(a.search(/\banime\b/))
                item.anilistId = foundUrl!.slice(6)
            }

        }))

        // filter only itens which has the anilist ID
        sortHasAnilistId = sortHasAnilistId.filter((item) => item.anilistId)

        dataSort = sortHasAnilistId

    }

    dataSort = dataSort.slice(0, resultLimit * Number(params.get("page") || 1))

    return NextResponse.json(
        {
            data: dataSort,
            allResultsLength: totalLength,
            lastUpdate: (AnimeDataOffline as { lastUpdate: string }).lastUpdate
        }
    )

}