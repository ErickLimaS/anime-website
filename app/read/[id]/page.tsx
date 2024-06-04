import React from 'react'
import styles from "./page.module.css"
import anilist from '@/app/api/anilistMedias'
import * as MediaCardExpanded from '@/app/components/MediaCards/MediaInfoExpandedWithCover'
import { MangaChapters, MangaInfo, MangaPages } from '@/app/ts/interfaces/apiMangadexDataInterface'
import manga from '@/app/api/consumetManga'
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
import ChaptersPages from './components/ChaptersPages/index'
import ChaptersListContainer from './components/ChaptersListContainer'
import { getClosestMangaResultByTitle } from '@/app/lib/dataFetch/optimizedFetchMangaOptions'
import { stringToUrlFriendly } from '@/app/lib/convertStrings'
import { FetchEpisodeError } from '@/app/components/MediaFetchErrorPage'

export const revalidate = 1800 // revalidate cached data every 30 minutes

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST MANGA ID
    searchParams: { chapter: string, source: string, q: string } // EPISODE NUMBER, SOURCE, EPISODE ID
}) {

    const mediaInfo = await anilist.getMediaInfo({ id: params.id }) as ApiDefaultResult

    return {
        title: !mediaInfo ? "Error | AniProject" : `Chapter ${searchParams.chapter} - ${mediaInfo.title.userPreferred} | AniProject`,
        description: `Read ${mediaInfo.title.userPreferred} - Chapter ${searchParams.chapter}. ${mediaInfo.description && mediaInfo.description}`,
    }
}

async function ReadChapter({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { chapter: string, source: "mangadex", q: string, page: string } // EPISODE NUMBER, SOURCE, EPISODE ID, LAST PAGE 
}) {

    const mediaInfo = await anilist.getMediaInfo({ id: params.id }) as ApiMediaResults

    let currChapterInfo: MangaChapters | undefined = undefined
    let allAvailableChaptersList: MangaChapters[] | undefined = undefined
    let hadFetchError = false

    const currMangaChapters = await manga.getChapterPages({ chapterId: searchParams.q }) as MangaPages[]

    const mangaTitleUrlFrindly = stringToUrlFriendly(mediaInfo.title.userPreferred).toLowerCase()

    let mangaInfo = await manga.getInfoFromThisMedia({ id: mangaTitleUrlFrindly }) as MangaInfo

    if (!mangaInfo) {
        const mangaClosestResult = await getClosestMangaResultByTitle(mangaTitleUrlFrindly, mediaInfo)

        mangaInfo = await manga.getInfoFromThisMedia({ id: mangaClosestResult as string }) as MangaInfo

        if (!mangaInfo) hadFetchError = true

    }

    if (hadFetchError) return <FetchEpisodeError mediaId={params.id} searchParams={searchParams} />

    allAvailableChaptersList = mangaInfo.chapters.filter(item => item.pages != 0)

    currChapterInfo = allAvailableChaptersList.find((item) => item.id == searchParams.q)

    if (!currMangaChapters || !allAvailableChaptersList) hadFetchError = true

    if (hadFetchError) return <FetchEpisodeError mediaId={params.id} searchParams={searchParams} />

    return (
        <main id={styles.container}>

            <div id={styles.heading_container}>

                <h1>
                    <span>{mediaInfo.title.userPreferred}: </span>
                    {currChapterInfo!.title == currChapterInfo!.chapterNumber ? `Chapter ${currChapterInfo!.chapterNumber}` : currChapterInfo!.title}
                </h1>

                <small>{currChapterInfo!.pages} Pages</small>

            </div>

            <ChaptersPages
                chapters={currMangaChapters}
                initialPage={Number(searchParams.page) || undefined}
            />

            <div id={styles.all_chapters_container}>

                <MediaCardExpanded.Container
                    mediaInfo={mediaInfo as ApiDefaultResult}

                >

                    <MediaCardExpanded.Description
                        description={mediaInfo.description}
                    />

                </MediaCardExpanded.Container>

                <ChaptersListContainer
                    mediaId={params.id}
                    currChapterId={searchParams.q}
                    chaptersList={allAvailableChaptersList!}
                />

            </div>

        </main>
    )
}

export default ReadChapter