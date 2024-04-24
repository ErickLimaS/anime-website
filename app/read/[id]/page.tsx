import React from 'react'
import styles from "./page.module.css"
import anilist from '@/api/anilist'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { MangaChapters, MangaInfo, MangaPages, MangaSearchResult } from '@/app/ts/interfaces/apiMangadexDataInterface'
import CommentSectionContainer from '@/app/components/CommentSectionContainer'
import Image from 'next/image'
import ErrorImg from "@/public/error-img-4.png"
import Link from 'next/link'
import manga from '@/api/manga'
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
import ChaptersPages from './components/ChaptersPages/index'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'
import ChaptersSideListContainer from './components/ChaptersSideListContainer'
import { getClosestMangaResultByTitle } from '@/app/lib/fetchMangaOnApi'

export const revalidate = 1800 // revalidate cached data every 30 minutes

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST MANGA ID
    searchParams: { chapter: string, source: string, q: string } // EPISODE NUMBER, SOURCE, EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    return {
        title: `Chapter ${searchParams.chapter} - ${mediaData.title.romaji} | AniProject`,
        description: `Read ${mediaData.title.romaji} - Chapter ${searchParams.chapter}. ${mediaData.description && mediaData.description}`,
    }
}

async function ReadChapter({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { chapter: string, source: "mangadex", q: string, page: string } // EPISODE NUMBER, SOURCE, EPISODE ID, LAST PAGE 
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiMediaResults

    let currChapterInfo: MangaChapters
    let allChapters: MangaChapters[]
    let error = false

    // fetch episode data
    const chapters = await manga.getChapterPages(searchParams.q) as MangaPages[]

    const query = stringToUrlFriendly(mediaData.title.romaji).toLowerCase()

    let mangaInfo = await manga.getInfoFromThisMedia(query) as MangaInfo

    // if the query dont match any id result, it will search results for this query,
    // than make the first request by the ID of the first search result 
    if (!mangaInfo) {
        const searchResultsForMedia = await getClosestMangaResultByTitle(query, mediaData)

        mangaInfo = await manga.getInfoFromThisMedia(searchResultsForMedia) as MangaInfo
    }

    allChapters = mangaInfo.chapters.filter(item => item.pages != 0)

    currChapterInfo = allChapters.filter((item) => item.id == searchParams.q)[0]

    if (!chapters || !allChapters) error = true

    // ERROR MESSAGE
    if (error) {
        return (
            <div id={styles.error_modal_container}>

                <div id={styles.heading_text_container}>
                    <div>
                        <Image src={ErrorImg} height={330} alt={'Error'} />
                    </div>

                    <h1>ERROR!</h1>

                    <p>What could have happened: </p>

                    <ul>
                        <li>{`${searchParams.source} doesn't have this media available.`}</li>
                        <li>{`Problems With Server.`}</li>
                        <li>{`${searchParams.source} API changes or not available.`}</li>
                    </ul>
                </div>


                <div id={styles.redirect_btns_container}>
                    <Link href={`/media/${params.id}`}>
                        Return To Media Page
                    </Link>

                    <Link href={"/"}>
                        Return to Home Page
                    </Link>

                </div>

            </div>
        )
    }

    return (
        <main id={styles.container}>

            <div id={styles.heading_container}>

                <h1>
                    <span>{mediaData.title.romaji}: </span>
                    {currChapterInfo.title == currChapterInfo.chapterNumber ? `Chapter ${currChapterInfo.chapterNumber}` : currChapterInfo.title}
                </h1>
                <small>{currChapterInfo.pages} Pages</small>

            </div>

            <ChaptersPages
                data={chapters}
                initialPage={Number(searchParams.page) || undefined}
            />

            <div id={styles.all_chapters_container}>

                <CardMediaCoverAndDescription
                    data={mediaData as ApiDefaultResult}
                    showButtons={false}
                />

                <ChaptersSideListContainer
                    mediaId={params.id}
                    currChapterId={searchParams.q}
                    episodesList={allChapters}
                />
            </div>

        </main>
    )
}

export default ReadChapter