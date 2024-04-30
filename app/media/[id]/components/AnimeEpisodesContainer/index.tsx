"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import NavButtons from '../../../../components/NavButtons';
import DotsSvg from "@/public/assets/three-dots-vertical.svg";
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg"
import { EpisodesType } from '@/app/ts/interfaces/apiAnilistDataInterface';
import NavPaginateItems from '@/app/media/[id]/components/PaginateItems';
import aniwatch from '@/api/aniwatch';
import {
  EpisodeAnimeWatch,
  EpisodesFetchedAnimeWatch,
  MediaInfoAniwatch
} from '@/app/ts/interfaces/apiAnimewatchInterface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import {
  doc, DocumentData,
  DocumentSnapshot, FieldPath,
  getDoc, getFirestore, setDoc
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp';
import ErrorImg from "@/public/error-img-2.png"
import Image from 'next/image';
import CrunchyrollEpisode from '../Episode/crunchyroll';
import GoGoAnimeEpisode from '../Episode/gogoanime';
import AniwatchEpisode from '../Episode/aniwatch';
import { AnimatePresence, motion } from 'framer-motion';
import simulateRange from '@/app/lib/simulateRange';
import { fetchWithAniWatch, fetchWithGoGoAnime } from '@/app/lib/fetchAnimeOnApi';
import { ImdbEpisode, ImdbMediaInfo } from '@/app/ts/interfaces/apiImdbInterface';
import { checkApiMisspellingMedias } from '@/app/lib/checkApiMediaMisspelling';
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface';

type EpisodesContainerTypes = {
  dataCrunchyroll: EpisodesType[],
  dataImdb?: ImdbMediaInfo["seasons"],
  dataImdbMapped: ImdbEpisode[],
  mediaTitle: string,
  mediaFormat: string,
  mediaId: number,
  totalEpisodes: number,
  vidsrcId: number | null
}

const loadingEpisodesMotion = {
  initial: {
    scale: 0
  },
  animate: {
    scale: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    scale: 0
  }
}

const episodePopupMotion = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1
    }
  }
}

function EpisodesContainer(props: EpisodesContainerTypes) {

  const { dataCrunchyroll } = props
  const { dataImdbMapped } = props

  const [loading, setLoading] = useState(false)
  const [optionsModalOpen, setOptionsModalOpen] = useState(false)
  const [episodesDataFetched, setEpisodesDataFetched] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[]>(dataCrunchyroll)

  const [allEpisodesWatched, setAllEpisodesWatched] = useState(false)

  const [mediaResultsInfoArray, setMediaResultsInfoArray] = useState<MediaInfoAniwatch[]>([])

  const [currentItems, setCurrentItems] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[] | null>(null)
  const [itemOffset, setItemOffset] = useState<number>(0);

  const [episodeSource, setEpisodeSource] = useState<SourceType["source"]>("crunchyroll")
  const [currEpisodesWatched, setCurrEpisodesWatched] = useState<{
    mediaId: number;
    episodeNumber: number;
    episodeTitle: string;
  }[]>()

  const auth = getAuth()

  const [user] = useAuthState(auth)

  const db = getFirestore(initFirebase())

  const [pageCount, setPageCount] = useState<number>(0)

  // the length os episodes array will be divided by 20, getting the range of pagination
  const rangeEpisodesPerPage = 20

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {

    setLoading(true) // needed to refresh episodes "Marked as Watched"

    const newOffset = event.selected * rangeEpisodesPerPage % episodesDataFetched.length

    setItemOffset(newOffset)

    setTimeout(() => setLoading(false), 250)  // needed to refresh episodes "Marked as Watched"

  }

  const setEpisodesSource: (parameter: SourceType["source"]) => void = async (parameter: SourceType["source"]) => {

    console.log(`Episodes Source Parameter: ${parameter} `)

    setEpisodeSource(parameter)

    getEpisodesFromNewSource(parameter)

  }

  const getEpisodesFromNewSource = async (source: SourceType["source"]) => {

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

        setCurrentItems(dataCrunchyroll.slice(itemOffset, endOffset))
        setPageCount(Math.ceil(dataCrunchyroll.length / rangeEpisodesPerPage))

        break

      case "gogoanime": // get data from GOGOANIME as default

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

        break

      case "aniwatch": // get data from ANIWATCH

        setEpisodeSource(chooseSource)

        const searchResultsForMedia = await fetchWithAniWatch(query, "search_list", props.mediaFormat, dataImdbMapped.length) as MediaInfoAniwatch[]

        setMediaResultsInfoArray(searchResultsForMedia)

        mediaEpisodes = await fetchWithAniWatch(query, "episodes", props.mediaFormat, dataImdbMapped.length) as EpisodesFetchedAnimeWatch["episodes"]

        setEpisodesDataFetched(mediaEpisodes)

        setCurrentItems(mediaEpisodes.slice(itemOffset, endOffset))
        setPageCount(Math.ceil(mediaEpisodes.length / rangeEpisodesPerPage))

        break

      default:

        console.log("need to work on it")

        break

    }

    setLoading(false)

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

  // CHECK WATCHED EPISODES ON FIRESTORE
  async function getEpisodesWatched() {

    if (!user) return

    const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

    if (!userDoc) return

    const isOnEpisodesList = userDoc.get("episodesWatched")

    if (!isOnEpisodesList) return

    const watchedEpisodes = isOnEpisodesList[props.mediaId] || null

    if (watchedEpisodes) setCurrEpisodesWatched(watchedEpisodes)

  }

  // OPENS MODAL and CHECKS IF ALL EPISODES WAS ALREADY MARKED 
  async function toggleOpenOptionsModal() {

    setOptionsModalOpen(!optionsModalOpen)

    const userDoc = await getDoc(doc(db, 'users', user!.uid)).then((res) => res.data())

    if (!userDoc) return

    if (userDoc.episodesWatched[props.mediaId]?.length == dataImdbMapped?.length) {
      setAllEpisodesWatched(true)
    }
    else {
      setAllEpisodesWatched(false)
    }

  }

  // MARK ALL EPISODES AS WATCHED ON FIRESTORE
  async function markAllEpisodesAsWatched() {

    if (!user) return

    function mapAllEpisodesInfo(index: number) {

      return {
        mediaId: props.mediaId,
        episodeNumber: index + 1,
        episodeTitle: dataImdbMapped[index]?.title
      }
    }

    const allEpisodes: { mediaId: number; episodeNumber: number; episodeTitle: string; }[] = []

    dataImdbMapped.map((item, key) => allEpisodes.push(mapAllEpisodesInfo(key)))

    await setDoc(doc(db, 'users', user.uid),
      {
        episodesWatched: {
          [props.mediaId]: allEpisodesWatched ? null : allEpisodes
        }

      } as unknown as FieldPath,
      { merge: true }
    ).then(() =>
      setAllEpisodesWatched(!allEpisodesWatched)
    )

  }

  // FETCHS EPISODES WATCHED 
  useEffect(() => {

    if (user) getEpisodesWatched()

  }, [user, props.mediaId, episodeSource, itemOffset])

  // FETCHS USERS SELECTED SOURCE / SET SOURCE
  useEffect(() => {

    if (user) {
      getUserDefaultSource()
    }
    else {
      // if there's no episodes coming from crunchyroll, gets episodes from other source
      getEpisodesFromNewSource(dataCrunchyroll.length == 0 ? "gogoanime" : "crunchyroll")
    }

  }, [user])

  // HANDLES THE PAGINATION
  useEffect(() => {

    const endOffset = itemOffset + rangeEpisodesPerPage;

    // if theres episodes from crunchyroll, sets the pagination pages
    if (episodeSource == "crunchyroll") {

      setPageCount(Math.ceil(dataCrunchyroll.length / rangeEpisodesPerPage));

    }

    setCurrentItems(episodesDataFetched.slice(itemOffset, endOffset))

  }, [episodesDataFetched, itemOffset, dataCrunchyroll, episodeSource])

  return (
    <React.Fragment>

      <div id={styles.episodes_heading}>
        <h2 className={styles.heading_style}>EPISODES</h2>

        <button
          id={styles.options_btn}
          onClick={() => toggleOpenOptionsModal()}
          data-active={optionsModalOpen}
        >
          <DotsSvg width={16} height={16} />
        </button>

        <AnimatePresence>
          {optionsModalOpen && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.options_modal_container}
            >

              <h5>OPTIONS</h5>

              <ul>
                <li>
                  <motion.button onClick={() => markAllEpisodesAsWatched()} whileTap={{ scale: 0.9 }}>
                    <CheckFillSvg width={16} height={16} /> {allEpisodesWatched ? "Unmark" : "Mark"} All Episodes as Watched
                  </motion.button>
                </li>
              </ul>

            </motion.div>

          )}
        </AnimatePresence>

      </div>

      <div>

        <div id={styles.container_heading}>

          <NavButtons
            functionReceived={setEpisodesSource as (parameter: string | number) => void}
            actualValue={episodeSource}
            showSourceStatus
            sepateWithSpan={true}
            options={
              [
                { name: "Crunchyroll", value: "crunchyroll" },
                { name: "GoGoAnime", value: "gogoanime" },
                { name: "Aniwatch", value: "aniwatch" }
              ]
            }
          />

          {/* SHOWS A SELECT WITH OTHER RESULTS FOR THIS MEDIA */}
          {/* ANIWATCH DONT GET THE RIGHT RESULT MOST OF TIMES */}
          <AnimatePresence>
            {(episodeSource == "aniwatch" && mediaResultsInfoArray.length > 1) && (
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
                  {mediaResultsInfoArray?.map((item, key) => (
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

        <motion.ol id={styles.container} data-loading={loading} animate={{ height: "auto" }}>

          <AnimatePresence>

            {currentItems && currentItems.map((item: EpisodesType | MediaEpisodes | EpisodeAnimeWatch | ImdbEpisode, key: number) => (

              !loading && (

                episodeSource == "crunchyroll" && (

                  <CrunchyrollEpisode
                    motionStyle={episodePopupMotion}
                    key={key}
                    data={item as EpisodesType}
                    episodeNumber={key + itemOffset + 1}
                    mediaId={props.mediaId}
                    episodesWatched={currEpisodesWatched}
                  />

                )
                ||
                episodeSource == "gogoanime" && (

                  <GoGoAnimeEpisode
                    motionStyle={episodePopupMotion}
                    key={key}
                    data={item as MediaEpisodes}
                    episodeNumber={key + itemOffset + 1}
                    title={dataImdbMapped[key + itemOffset]?.title}
                    episodeDescription={dataImdbMapped[key + itemOffset]?.description || undefined}
                    backgroundImg={dataImdbMapped[key + itemOffset]?.img?.hd || dataCrunchyroll[key + itemOffset]?.thumbnail}
                    mediaId={props.mediaId}
                    episodesWatched={currEpisodesWatched}
                  />

                )
                ||
                episodeSource == "aniwatch" && (

                  <AniwatchEpisode
                    motionStyle={episodePopupMotion}
                    key={key}
                    data={item as EpisodeAnimeWatch}
                    episodeNumber={key + itemOffset + 1}
                    episodeDescription={dataImdbMapped[key + itemOffset]?.description || undefined}
                    backgroundImg={dataImdbMapped[key + itemOffset]?.img?.hd || dataCrunchyroll[key + itemOffset]?.thumbnail}
                    mediaId={props.mediaId}
                    episodesWatched={currEpisodesWatched}
                  />

                )
              )

            ))}

          </AnimatePresence>
        </motion.ol>

        {loading && (
          <motion.div
            id={styles.loading_episodes_container}
            variants={loadingEpisodesMotion}
            initial="initial"
            animate="animate"
            exit="exit"
          >

            {simulateRange(rangeEpisodesPerPage).map((item, key) => (

              <motion.div
                key={key}
                variants={loadingEpisodesMotion}
              >

                <LoadingSvg width={60} height={60} alt="Loading Episodes" />

              </motion.div>

            ))}

          </motion.div>
        )}

        {((episodesDataFetched.length == 0) && !loading) && (
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

      </div>
    </React.Fragment >
  )
}

export default EpisodesContainer