"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import NavButtons from '../../../../components/NavButtons';
import gogoanime from '@/api/gogoanime';
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly';
import GoGoAnimeEpisode from '../GoGoAnimeEpisodeContainer';
import CrunchyrollEpisode from '../CrunchyrollEpisodeContainer';
import { EpisodesType } from '@/app/ts/interfaces/apiAnilistDataInterface';
import NavPaginateItems from '@/app/components/PaginateItems';

function EpisodesContainer(props: { data: EpisodesType[], mediaTitle: string, mediaId: number }) {

  const { data } = props

  const [loading, setLoading] = useState(false)
  const [episodesDataFetched, setEpisodesDataFetched] = useState<EpisodesType[] | MediaEpisodes[]>(data)

  const [currentItems, setCurrentItems] = useState<EpisodesType[] | MediaEpisodes[] | null>(null);
  const [itemOffset, setItemOffset] = useState<number>(0);


  const [episodeSource, setEpisodeSource] = useState<string>("crunchyroll")

  // the length os episodes array will be divided by 25, getting the range of pagination
  const rangeEpisodesPerPage = 25

  const [pageCount, setPageCount] = useState<number>(0);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = event.selected * rangeEpisodesPerPage % episodesDataFetched.length;

    setItemOffset(newOffset);
  };

  const setEpisodesSource: (parameter: string) => void = async (parameter: string) => {

    console.log(`Episodes Source Parameter: ${parameter} `)

    getEpisodesFromNewSource(parameter)

  }

  const getEpisodesFromNewSource = async (source: string) => {

    // if data props has 0 length, it is set to get data from gogoanime
    const chooseSource = source == "crunchyroll" && data.length == 0 ? "googanime" : source

    if (chooseSource == episodeSource) return

    setLoading(true)

    const endOffset = itemOffset + rangeEpisodesPerPage

    // transform title in some way it can get query by other sources removing special chars
    const query = stringToUrlFriendly(props.mediaTitle)

    let mediaEpisodes

    switch (chooseSource) {

      case "crunchyroll":

        setEpisodeSource(chooseSource)

        setEpisodesDataFetched(data)

        setCurrentItems(data.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(data.length / rangeEpisodesPerPage));

        setLoading(false)

        break

      // get data from gogoanime as default
      default:

        mediaEpisodes = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo

        // if the name dont match any results, it will search for the query on the api, than make a new request by the ID of the first result 
        if (mediaEpisodes == null) {
          const searchResultsForMedia = await gogoanime.searchMedia(query, "anime") as MediaSearchResult[]

          // try to found a result that matches the title from anilist on gogoanime (might work in some cases)
          const closestResult = searchResultsForMedia.find((item) => item.id.includes(query + "-tv"))

          mediaEpisodes = await gogoanime.getInfoFromThisMedia(closestResult?.id || searchResultsForMedia[0].id, "anime") as MediaInfo

        }

        setEpisodeSource(chooseSource)

        setEpisodesDataFetched(mediaEpisodes.episodes)

        setCurrentItems(mediaEpisodes.episodes.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(mediaEpisodes.episodes.length / rangeEpisodesPerPage));

        setLoading(false)

        break

    }

  }

  useEffect(() => {

    // if there's no episodes coming from crunchyroll, gets episodes from other source
    getEpisodesFromNewSource(episodeSource)

    const endOffset = itemOffset + rangeEpisodesPerPage;

    if (episodeSource == "crunchyroll") {

      setPageCount(Math.ceil(data.length / rangeEpisodesPerPage));

    }

    setCurrentItems(episodesDataFetched.slice(itemOffset, endOffset));

  }, [episodesDataFetched, itemOffset, data, episodeSource])

  return (
    <div>

      <div id={styles.container_heading}>

        <NavButtons
          functionReceived={setEpisodesSource as (parameter: string | number) => void}
          actualValue={episodeSource == "crunchyroll" && data.length == 0 ? "gogoanime" : episodeSource}
          options={data.length == 0 ?
            [{ name: "GoGoAnime", value: "gogoanime" }] :
            [{ name: "Crunchyroll", value: "crunchyroll" }, { name: "GoGoAnime", value: "gogoanime" }]
          }
          sepateWithSpan={true}
        />

      </div>

      <ol id={styles.container} data-loading={loading}>

        {currentItems && currentItems.map((item, key: number) => (

          loading ? (
            <li key={key}>
              <LoadingSvg width={16} height={16} alt="Loading Episodes" />
            </li>
          ) : (

            episodeSource == "crunchyroll" ? (

              <CrunchyrollEpisode key={key} data={item as EpisodesType} mediaId={props.mediaId} />

            ) : (

              <GoGoAnimeEpisode key={key} data={item as MediaEpisodes} mediaId={props.mediaId} />

            )
          )

        ))}

      </ol>

      {(episodesDataFetched.length == 0 && !loading) && (
        <p>No episodes available.</p>
      )}

      <nav id={styles.pagination_buttons_container}>

        <NavPaginateItems
          onPageChange={handlePageClick}
          pageCount={pageCount}
        />


      </nav>

    </div >
  )
}

export default EpisodesContainer