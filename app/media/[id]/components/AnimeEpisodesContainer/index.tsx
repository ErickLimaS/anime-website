"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import NavButtons from '../../../../components/NavButtons';
import gogoanime from '@/api/gogoanime';
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg"
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly';
import GoGoAnimeEpisode from '../GoGoAnimeEpisodeContainer';
import CrunchyrollEpisode from '../CrunchyrollEpisodeContainer';
import { EpisodesType } from '@/app/ts/interfaces/apiAnilistDataInterface';
import NavPaginateItems from '@/app/components/PaginateItems';
import aniwatch from '@/api/aniwatch';
import AniwatchEpisode from '../AniwatchEpisodeContainer';
import { EpisodeAnimeWatch, EpisodesFetchedAnimeWatch, MediaInfoAniwatch, MediaInfoFetchedAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface';

function EpisodesContainer(props: { data: EpisodesType[], mediaTitle: string, mediaId: number, totalEpisodes: number }) {

  const { data } = props

  const [loading, setLoading] = useState(false)
  const [episodesDataFetched, setEpisodesDataFetched] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[]>(data)

  const [mediaResultsInfoArray, setMediaResultsInfoArray] = useState<MediaInfoAniwatch[]>([])

  const [currentItems, setCurrentItems] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[] | null>(null);
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

    setEpisodeSource(parameter)

    getEpisodesFromNewSource(parameter)

  }

  const getEpisodesFromNewSource = async (source: string) => {

    // if data props has 0 length, it is set to get data from gogoanime
    const chooseSource = source == "crunchyroll" && data.length == 0 ? "googanime" : source

    if (chooseSource == episodeSource) return

    setLoading(true)

    const endOffset = itemOffset + rangeEpisodesPerPage

    // transform title in some way it can get query by other sources removing special chars
    const query = props.mediaTitle

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
      case "gogoanime":

        mediaEpisodes = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo

        // if the name dont match any results, it will search for the query on the api, than make a new request by the ID of the first result 
        if (mediaEpisodes == null) {
          const searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(query), "anime") as MediaSearchResult[]

          // try to found a result that matches the title from anilist on gogoanime (might work in some cases)
          const closestResult = searchResultsForMedia.find((item) => item.id.includes(query + "-tv"))

          mediaEpisodes = await gogoanime.getInfoFromThisMedia(closestResult?.id || searchResultsForMedia[0].id, "anime") as MediaInfo

        }

        setEpisodeSource(chooseSource)

        // if theres no episodes on data, it simulates filling a array with episodes 
        if (mediaEpisodes.episodes.length == 0) {

          const range = (n: number) => [...Array(n).keys()]

          const episodes: MediaEpisodes[] = []

          range(props.totalEpisodes).map((item, key) => (

            episodes.push({
              number: key + 1,
              id: `${mediaEpisodes!.id}-episode-${key + 1}` || `${(searchResultsForMedia as any)[0].id}-episode-${key + 1}`,
              url: ""
            })

          ))

          setEpisodesDataFetched(episodes)

          setCurrentItems(episodes.slice(itemOffset, endOffset))
          setPageCount(Math.ceil(episodes.length / rangeEpisodesPerPage))

        }
        else {

          setEpisodesDataFetched(mediaEpisodes.episodes)

          setCurrentItems(mediaEpisodes.episodes.slice(itemOffset, endOffset))
          setPageCount(Math.ceil(mediaEpisodes.episodes.length / rangeEpisodesPerPage))

        }

        setLoading(false)

        break

      // get data from aniwatch
      default: // aniwatch

        const searchResultsForMedia = await aniwatch.searchMedia(query) as MediaInfoFetchedAnimeWatch

        setMediaResultsInfoArray(searchResultsForMedia.animes)

        const closestResult = searchResultsForMedia.animes.find((item) => item.name.toUpperCase().includes(query)) || searchResultsForMedia.animes[0]

        mediaEpisodes = await aniwatch.getEpisodes(closestResult.id) as EpisodesFetchedAnimeWatch

        setEpisodeSource(chooseSource)

        setEpisodesDataFetched(mediaEpisodes.episodes)

        setCurrentItems(mediaEpisodes.episodes.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(mediaEpisodes.episodes.length / rangeEpisodesPerPage));

        setLoading(false)

        break

    }

  }

  // user can select a result that matches the page, if not correct
  const getEpisodesToThisMediaFromAniwatch = async (id: string) => {

    setLoading(true)

    const endOffset = itemOffset + rangeEpisodesPerPage

    const mediaEpisodes = await aniwatch.getEpisodes(id) as EpisodesFetchedAnimeWatch

    setEpisodesDataFetched(mediaEpisodes.episodes)

    setCurrentItems(mediaEpisodes.episodes.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(mediaEpisodes.episodes.length / rangeEpisodesPerPage));

    setLoading(false)

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
            [{ name: "GoGoAnime", value: "gogoanime" }, { name: "Aniwatch", value: "aniwatch" }] :
            [{ name: "Crunchyroll", value: "crunchyroll" }, { name: "GoGoAnime", value: "gogoanime" }, { name: "Aniwatch", value: "aniwatch" }]
          }
          sepateWithSpan={true}
        />

        {episodeSource == "aniwatch" && (
          <div id={styles.select_media_container}>

            <small>Wrong Episodes? Select bellow!</small>

            <select onChange={(e) => getEpisodesToThisMediaFromAniwatch(e.target.value)}>
              {mediaResultsInfoArray.length > 0 && mediaResultsInfoArray?.map((item, key) => (
                <option key={key} value={item.id}>{item.name}</option>
              ))}
            </select>

          </div>
        )}

      </div>

      <ol id={styles.container} data-loading={loading}>

        {currentItems && currentItems.map((item: EpisodesType | MediaEpisodes | EpisodeAnimeWatch, key: number) => (

          loading ? (
            <li key={key}>
              <LoadingSvg width={16} height={16} alt="Loading Episodes" />
            </li>
          ) : (

            episodeSource == "crunchyroll" && (

              <CrunchyrollEpisode key={key} data={item as EpisodesType} mediaId={props.mediaId} />

            )
            ||
            episodeSource == "gogoanime" && (

              <GoGoAnimeEpisode key={key} data={item as MediaEpisodes} mediaId={props.mediaId} />

            )
            ||
            episodeSource == "aniwatch" && (

              <AniwatchEpisode key={key} data={item as EpisodeAnimeWatch} mediaId={props.mediaId} />

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