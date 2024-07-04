import React from 'react'
import GridHeadingMediaInfo from './GridInfo'
import HeadingInfo from './HeadingInfo'
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { ImdbEpisode, ImdbMediaInfo } from '@/app/ts/interfaces/apiImdbInterface'

export default function PageHeading({ mediaInfo, imdbMediaInfo, searchParams, imdbEpisodes }: {
    mediaInfo: ApiMediaResults, imdbMediaInfo: ImdbMediaInfo, searchParams: { lang?: string }, imdbEpisodes?: ImdbEpisode[]
}) {

    return (
        <React.Fragment>

            <HeadingInfo
                mediaInfo={mediaInfo}
                imdbMediaInfo={imdbMediaInfo}
                searchParams={searchParams}
                imdbEpisodes={imdbEpisodes}
            />

            <GridHeadingMediaInfo
                mediaInfo={mediaInfo}
                imdbEpisodes={imdbEpisodes}
            />

        </React.Fragment>
    )

}
