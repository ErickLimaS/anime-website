"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import NavButtons from '../../../../components/NavButtons';
import gogoanime from '@/api/gogoanime';
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg"
import { EpisodesType } from '@/app/ts/interfaces/apiAnilistDataInterface';
import NavPaginateItems from '@/app/media/[id]/components/PaginateItems';
import aniwatch from '@/api/aniwatch';
import {
  EpisodeAnimeWatch, EpisodesFetchedAnimeWatch,
  MediaInfoAniwatch, MediaInfoFetchedAnimeWatch
} from '@/app/ts/interfaces/apiAnimewatchInterface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initFirebase } from '@/firebase/firebaseApp';
import ErrorImg from "@/public/error-img-2.png"
import Image from 'next/image';
import CrunchyrollEpisode from '../CrunchyrollEpisodeContainer';
import GoGoAnimeEpisode from '../GoGoAnimeEpisodeContainer';
import AniwatchEpisode from '../AniwatchEpisodeContainer';
import { AnimatePresence, motion } from 'framer-motion';
import simulateRange from '@/app/lib/simulateRange';
import { fetchWithAniWatch, fetchWithGoGoAnime } from '@/app/lib/fetchAnimeOnApi';
import regexOnlyAlphabetic from '@/app/lib/regexOnlyAlphabetic';
import { ImdbEpisode } from '@/app/ts/interfaces/apiImdbInterface';
import { checkApiMisspellingMedias } from '@/app/lib/checkApiMediaMisspelling';

type EpisodesContainerTypes = {
  dataCrunchyroll: EpisodesType[],
  dataImdb: ImdbEpisode[],
  mediaTitle: string,
  mediaFormat: string,
  mediaId: number,
  totalEpisodes: number
}

function EpisodesContainer(props: EpisodesContainerTypes) {

  const { dataCrunchyroll } = props
  const { dataImdb } = props

  const [loading, setLoading] = useState(false)
  const [episodesDataFetched, setEpisodesDataFetched] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[]>(dataCrunchyroll)

  const [mediaResultsInfoArray, setMediaResultsInfoArray] = useState<MediaInfoAniwatch[]>([])

  const [currentItems, setCurrentItems] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[] | null>(null);
  const [itemOffset, setItemOffset] = useState<number>(0);

  const [episodeSource, setEpisodeSource] = useState<string>("")

  const auth = getAuth()

  const [user] = useAuthState(auth)

  const db = getFirestore(initFirebase());

  // the length os episodes array will be divided by 25, getting the range of pagination
  const rangeEpisodesPerPage = 25

  const [pageCount, setPageCount] = useState<number>(0);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = event.selected * rangeEpisodesPerPage % episodesDataFetched.length;

    setItemOffset(newOffset);
  }

  const setEpisodesSource: (parameter: string) => void = async (parameter: string) => {

    console.log(`Episodes Source Parameter: ${parameter} `)

    setEpisodeSource(parameter)

    getEpisodesFromNewSource(parameter)

  }

  const getEpisodesFromNewSource = async (source: string) => {

    // if data props has 0 length, it is set to get data from gogoanime
    const chooseSource = source

    if ((chooseSource == episodeSource) && episodesDataFetched.length > 0) return

    setLoading(true)

    const endOffset = itemOffset + rangeEpisodesPerPage

    // transform title in some way it can get query by other sources removing special chars
    const query = props.mediaTitle

    let mediaEpisodes

    switch (chooseSource) {

      case "crunchyroll":

        setEpisodeSource(chooseSource)

        setEpisodesDataFetched(dataCrunchyroll)

        setCurrentItems(dataCrunchyroll.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(dataCrunchyroll.length / rangeEpisodesPerPage));

        setLoading(false)

        break

      // get data from GOGOANIME as default
      case "gogoanime":

        setEpisodeSource(chooseSource)
        mediaEpisodes = await fetchWithGoGoAnime(query, "episodes") as MediaEpisodes[]

        if (mediaEpisodes == null) {
          setLoading(false)
          setEpisodesDataFetched([])
          return

        }

        setEpisodesDataFetched(mediaEpisodes as MediaEpisodes[])

        setCurrentItems((mediaEpisodes as MediaEpisodes[]).slice(itemOffset, endOffset))
        setPageCount(Math.ceil((mediaEpisodes as MediaEpisodes[]).length / rangeEpisodesPerPage))

        setLoading(false)

        break

      // get data from ANIWATCH
      default:

        setEpisodeSource(chooseSource)

        const searchResultsForMedia = await aniwatch.searchMedia(regexOnlyAlphabetic(query)) as MediaInfoFetchedAnimeWatch

        setMediaResultsInfoArray(searchResultsForMedia.animes.filter(item => item.type.toLowerCase() == props.mediaFormat.toLowerCase()))

        setEpisodeSource(chooseSource)

        mediaEpisodes = await fetchWithAniWatch(query, "episodes", props.mediaFormat, dataImdb.length) as EpisodesFetchedAnimeWatch["episodes"]

        setEpisodesDataFetched(mediaEpisodes)

        setCurrentItems(mediaEpisodes.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(mediaEpisodes.length / rangeEpisodesPerPage));

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

  // get source setted on user profile
  const getUserDefaultSource = async () => {

    const userData = await getDoc(doc(db, "users", user!.uid))

    const userSource = await userData.get("videoSource").toLowerCase() || "crunchyroll"

    getEpisodesFromNewSource(userSource)

    setEpisodeSource(userSource)

  }

  useEffect(() => {

    if (user) {
      getUserDefaultSource()
    }
    else {
      // if there's no episodes coming from crunchyroll, gets episodes from other source
      getEpisodesFromNewSource(dataCrunchyroll.length == 0 ? "gogoanime" : "crunchyroll")
    }

  }, [user])

  useEffect(() => {

    const endOffset = itemOffset + rangeEpisodesPerPage;

    // if theres episodes from crunchyroll, sets the pagination pages
    if (episodeSource == "crunchyroll") {

      setPageCount(Math.ceil(dataCrunchyroll.length / rangeEpisodesPerPage));

    }

    setCurrentItems(episodesDataFetched.slice(itemOffset, endOffset));

  }, [episodesDataFetched, itemOffset, dataCrunchyroll, episodeSource])

  const loadingEpisodesMotion = {
    initial: {
      scale: 0,
    },
    animate: {
      scale: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div>

      <div id={styles.container_heading}>

        <NavButtons
          functionReceived={setEpisodesSource as (parameter: string | number) => void}
          actualValue={episodeSource}
          options={
            [
              { name: "Crunchyroll", value: "crunchyroll" },
              { name: "GoGoAnime", value: "gogoanime" },
              { name: "Aniwatch", value: "aniwatch" }
            ]
          }
          sepateWithSpan={true}
        />

        <AnimatePresence>
          {episodeSource == "aniwatch" && (
            <motion.div
              id={styles.select_media_container}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >

              <small>Wrong Episodes? Select bellow!</small>

              <select
                onChange={(e) => getEpisodesToThisMediaFromAniwatch(e.target.value)}
                defaultValue={checkApiMisspellingMedias(props.mediaTitle).toLowerCase()}
              >
                {mediaResultsInfoArray.length > 0 && mediaResultsInfoArray?.map((item, key) => (
                  <option
                    key={key}
                    value={item.id.toLowerCase()}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <ol id={styles.container} data-loading={loading}>

        <AnimatePresence>

          {currentItems && currentItems.map((item: EpisodesType | MediaEpisodes | EpisodeAnimeWatch, key: number) => (

            !loading && (

              episodeSource == "crunchyroll" && (

                <CrunchyrollEpisode
                  key={key}
                  data={item as EpisodesType}
                  mediaId={props.mediaId}
                />

              )
              ||
              episodeSource == "gogoanime" && (

                <GoGoAnimeEpisode
                  key={key}
                  data={item as MediaEpisodes}
                  title={dataImdb[key + itemOffset]?.title}
                  backgroundImg={dataImdb[key + itemOffset]?.img?.hd}
                  mediaId={props.mediaId}
                />

              )
              ||
              episodeSource == "aniwatch" && (

                <AniwatchEpisode
                  key={key}
                  data={item as EpisodeAnimeWatch}
                  backgroundImg={dataImdb[key + itemOffset]?.img?.hd}
                  mediaId={props.mediaId}
                />

              )
            )

          ))}

        </AnimatePresence>
      </ol>

      {loading && (
        <motion.div
          id={styles.loading_episodes_container}
          variants={loadingEpisodesMotion}
          initial="initial"
          animate="animate"
        >

          {simulateRange(15).map((item, key) => (

            <motion.div
              key={key}
              variants={loadingEpisodesMotion}
            >

              <LoadingSvg width={60} height={60} alt="Loading Episodes" />

            </motion.div>

          ))}

        </motion.div>
      )}

      {(episodesDataFetched.length == 0 && !loading) && (
        <div id={styles.no_episodes_container}>

          <Image src={ErrorImg} alt='Error' height={200} />

          <p>Not available on <span>{episodeSource}</span></p>

        </div>
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