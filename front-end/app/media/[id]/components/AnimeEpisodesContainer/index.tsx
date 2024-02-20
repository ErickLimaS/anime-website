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

function EpisodesContainer(props: { data: EpisodesType[], mediaTitle: string, mediaId: number }) {

  const { data } = props

  const [loading, setLoading] = useState(false)
  const [episodesDataFetched, setEpisodesDataFetched] = useState<EpisodesType[] | MediaEpisodes[]>(data)

  const [episodeSource, setEpisodeSource] = useState<string>("crunchyroll")
  const [pageNumber, setPageNumber] = useState<number>(0)

  const rangeEpisodesPerPage = 25
  // the length os episodes array will be divided by 25, getting the range of pagination
  const paginationNumber = Math.ceil((episodesDataFetched.length + 1) / rangeEpisodesPerPage)

  // set new page of episodes
  const setNewPage: (parameter: number) => void = async (parameter: number) => {

    console.log(`Episodes Page Parameter: ${parameter} `)

    setPageNumber(parameter)

  }

  const setEpisodesSource: (parameter: string) => void = async (parameter: string) => {

    console.log(`Episodes Source Parameter: ${parameter} `)

    getEpisodesFromNewSource(parameter)

  }

  // get range within the episodes and returns array of values to be shown on nav buttons
  const returnPaginationRange = () => {

    let buttonsOptions = []

    for (let i = 1; i <= paginationNumber; i++) {

      buttonsOptions.push({ name: i.toString(), value: i })

    }

    return buttonsOptions

  }

  const getEpisodesFromNewSource = async (source: string) => {

    // if data props has 0 length, it is set to get data from gogoanime
    const chooseSource = source == "crunchyroll" && data.length == 0 ? "googanime" : source

    if (chooseSource == episodeSource) return

    setLoading(true)

    // reiniciate the episodes page counter
    setPageNumber(0)

    // transform title in some way it can get query by other sources removing special chars
    const query = stringToUrlFriendly(props.mediaTitle)

    let mediaEpisodes

    switch (chooseSource) {

      case "crunchyroll":

        setEpisodesDataFetched(data)

        setEpisodeSource(chooseSource)

        setLoading(false)

        break

      // get data from gogoanime as default
      default:

        mediaEpisodes = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo

        // if the name dont match any results, it will search for the query on the api, than make a new request by the ID of the first result 
        if (mediaEpisodes == null) {
          const searchResultsForMedia = await gogoanime.searchMedia(query, "anime") as MediaSearchResult[]

          mediaEpisodes = await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0].id, "anime") as MediaInfo
        }

        setEpisodeSource(chooseSource)

        setEpisodesDataFetched(mediaEpisodes.episodes)

        setLoading(false)

        break

    }

  }

  useEffect(() => {
    // if there is no episodes on crunchyroll, gets episodes from other source
    getEpisodesFromNewSource(episodeSource)

    returnPaginationRange()
  }, [])

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

        {episodesDataFetched.slice(
          //if page is on 0 (is the default page number), it just begins from 0, after that it multiples by the number of page 
          (pageNumber != 0 ? (rangeEpisodesPerPage * (pageNumber - 1)) : 0),
          //if page is on 0, it will be set as 25, after that it multiples by the number of page 
          (pageNumber != 0 ? (rangeEpisodesPerPage * (pageNumber)) : (rangeEpisodesPerPage * (pageNumber + 1)))
        ).map((item, key: number) => (

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

      {episodesDataFetched.length == 0 && (
        <p>No episodes available.</p>
      )}

      <nav id={styles.pagination_buttons_container}>

        <NavButtons
          functionReceived={setNewPage as (parameter: string | number) => void}
          options={returnPaginationRange()}
          actualValue={pageNumber}
          previousAndNextButtons={true}
          customForPagination={true}
        />

      </nav>

    </div >
  )
}

export default EpisodesContainer