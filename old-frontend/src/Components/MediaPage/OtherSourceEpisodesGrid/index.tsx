import React, { useState } from 'react'
import EpisodesGoGoAnime from '../EpisodesGoGoAnime/EpisodesGoGoAnime'
import gogoAnime from '../../../API/gogo-anime'

function OtherSourceEpisodesGrid({ episodes, mediaInfo, animeTitleWithoutSpace, indexEpisodesPagination, setVideoURL, setVideoReady, setLoadingVideoplayer, setChoseEpisoded }: any) {

    // Gets the index of the current page and shows which episodes within the range in a total
    // of 24 its available
    const startSlice: number = indexEpisodesPagination === 0 ? 0 : 24 * indexEpisodesPagination
    const endSlice: number = 24 * (indexEpisodesPagination + 1)

    const [videoId, setVideoId] = useState<String>()

    //gets the streaming url of chosed episode
    const getStreamingLink = async (id: String) => {

        setLoadingVideoplayer(true)
        setVideoReady(false)

        setVideoId(id)

        const data = await gogoAnime.getStreamingVideoUrlVIDCDN(id)

        setVideoURL(data.Referer)

        setLoadingVideoplayer(false)
        setVideoReady(true)

    }

    return (

        episodes.slice(startSlice, endSlice).map((item: any) => (
            <a href='#player-heading'
                key={item.episodeId}
                onClick={() => setChoseEpisoded(item.episodeNum)}
            >
                <EpisodesGoGoAnime
                    data={item}
                    media={mediaInfo}
                    mediaTitle={animeTitleWithoutSpace}
                    streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                />
            </a>
        ))
    )
}

export default OtherSourceEpisodesGrid