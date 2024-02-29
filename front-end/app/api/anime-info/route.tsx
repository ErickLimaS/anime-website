import { NextRequest, NextResponse } from "next/server";
import AnimeDataOffline from "./anime-offline-database.json"

export async function GET(request: NextRequest) {

    const params = request.nextUrl.searchParams

    const pageLimit = 12

    let dataSort = (AnimeDataOffline as any).data

    if (params.get("type")) dataSort = dataSort.filter((item: { type: string }) => item.type == params.get("type")!.toUpperCase())

    if (params.get("genre")) dataSort = dataSort.filter((item: { tags: string[] }) => item.tags.some(a => (params.get("genre")!.includes(a))))

    if (params.get("status")) dataSort = dataSort.filter((item: { status: string }) => item.status == params.get("status")!.toUpperCase())

    if (params.get("year")) dataSort = dataSort.filter((item: { animeSeason: { year: number } }) => item.animeSeason.year == Number(params.get("year")))

    if (params.get("title")) dataSort = dataSort.filter((item: { title: string }) => item.title.toLowerCase().includes(params.get("title")!.toLowerCase()))

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

    dataSort = dataSort.slice(0, pageLimit * Number(params.get("page") || 1))

    return NextResponse.json(
        {
            data: dataSort,
            allResultsLength: totalLength
        }
    )

}