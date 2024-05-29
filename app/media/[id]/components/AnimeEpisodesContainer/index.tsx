"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import NavigationButtons from '../../../../components/NavigationButtons';
import DotsSvg from "@/public/assets/three-dots-vertical.svg";
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg"
import { ApiDefaultResult, ApiMediaResults, EpisodesType } from '@/app/ts/interfaces/apiAnilistDataInterface';
import NavPaginateItems from '@/app/media/[id]/components/PaginateItems';
import aniwatch from '@/app/api/aniwatch';
import {
  EpisodeAnimeWatch,
  EpisodesFetchedAnimeWatch,
  MediaInfoAniwatch
} from '@/app/ts/interfaces/apiAnimewatchInterface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, User } from 'firebase/auth';
import {
  doc, DocumentData,
  DocumentSnapshot, FieldPath,
  Firestore,
  getDoc, getFirestore, setDoc
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp';
import ErrorImg from "@/public/error-img-2.png"
import Image from 'next/image';
import CrunchyrollEpisode from './components/EpisodeBySource/crunchyroll';
import GoGoAnimeEpisode from './components/EpisodeBySource/gogoanime';
import AniwatchEpisode from './components/EpisodeBySource/aniwatch';
import { AnimatePresence, motion } from 'framer-motion';
import simulateRange from '@/app/lib/simulateRange';
import { optimizedFetchOnAniwatch, optimizedFetchOnGoGoAnime } from '@/app/lib/optimizedFetchAnimeOptions';
import { ImdbEpisode, ImdbMediaInfo } from '@/app/ts/interfaces/apiImdbInterface';
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface';
import { checkAnilistTitleMisspelling } from '@/app/lib/checkApiMediaMisspelling';
import { useSearchParams } from 'next/navigation';

type EpisodesContainerTypes = {
  imdb: {
    mediaSeasons: ImdbMediaInfo["seasons"],
    episodesList: ImdbEpisode[],
  },
  mediaInfo: ApiDefaultResult | ApiMediaResults,
  crunchyrollInitialEpisodes: EpisodesType[]
}

const framerMotionLoadingEpisodes = {
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

const framerMotionEpisodePopup = {
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

export default function EpisodesContainer({ imdb, mediaInfo, crunchyrollInitialEpisodes }: EpisodesContainerTypes) {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [episodesList, setEpisodesList] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[]>(crunchyrollInitialEpisodes)

  const [isEpisodesDubbed, setIsEpisodesDubbed] = useState<boolean>(false)

  const [mediaResultsInfoArray, setMediaResultsInfoArray] = useState<MediaInfoAniwatch[]>([])

  const [currAnimesList, setCurrAnimesList] = useState<EpisodesType[] | MediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[] | null>(null)
  const [itemOffset, setItemOffset] = useState<number>(0)

  const [currEpisodesSource, setCurrEpisodesSource] = useState<SourceType["source"]>("crunchyroll")

  const [currEpisodesWatched, setCurrEpisodesWatched] = useState<{
    mediaId: number;
    episodeNumber: number;
    episodeTitle: string;
  }[]>()

  const searchParams = useSearchParams()

  const currSearchParams = new URLSearchParams(Array.from(searchParams.entries()))

  const [pageNumber, setPageNumber] = useState<number>(0)
  const auth = getAuth()

  const [user] = useAuthState(auth)

  const db = getFirestore(initFirebase())

  // the episodes array length will be divided by 20, getting the range of pagination
  const rangeEpisodesPerPage = 20

  useEffect(() => {

    if (typeof window !== 'undefined') {

      setIsEpisodesDubbed(localStorage.getItem("dubEpisodes") == "true")

    }

  }, [typeof window])

  useEffect(() => {

    if (user) getUserPreferredSource()
    else fetchEpisodesFromSource(crunchyrollInitialEpisodes.length == 0 ? "gogoanime" : "crunchyroll")

  }, [user])

  useEffect(() => {

    const endOffset = itemOffset + rangeEpisodesPerPage;

    if (currEpisodesSource == "crunchyroll") setPageNumber(Math.ceil(crunchyrollInitialEpisodes.length / rangeEpisodesPerPage));

    if (episodesList) setCurrAnimesList(episodesList.slice(itemOffset, endOffset))

  }, [episodesList, itemOffset, crunchyrollInitialEpisodes, currEpisodesSource])

  useEffect(() => { if (user) getUserEpisodesWatched() }, [user, mediaInfo.id, currEpisodesSource, itemOffset])

  useEffect(() => {

    const paramsSource = currSearchParams.get("source") as SourceType["source"]

    if (paramsSource == "crunchyroll" || paramsSource == "aniwatch" || paramsSource == "gogoanime") {

      setCurrEpisodesSource(paramsSource)
      fetchEpisodesFromSource(paramsSource)

    }

  }, [searchParams])

  useEffect(() => {

    const pageParams = Number(currSearchParams.get("page"))

    if (episodesList && pageParams) {
      setItemOffset((pageParams || 0) * rangeEpisodesPerPage % episodesList.length)
    }

  }, [episodesList, currSearchParams.get("source")])

  useEffect(() => {

    if (currEpisodesSource == "gogoanime") fetchEpisodesFromSource(currEpisodesSource)

  }, [isEpisodesDubbed])

  async function getUserPreferredSource() {

    const useDoc = await getDoc(doc(db, "users", user!.uid))

    const userSelectedSource = await useDoc.get("videoSource").toLowerCase() || "crunchyroll"

    fetchEpisodesFromSource(userSelectedSource)

    setCurrEpisodesSource(userSelectedSource)

  }

  async function getUserEpisodesWatched() {

    if (!user) return

    const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

    const userEpisodesWatchedList = userDoc.get("episodesWatched")

    const mediaEpisodesWatchedList = userEpisodesWatchedList[mediaInfo.id] || null

    if (mediaEpisodesWatchedList) setCurrEpisodesWatched(mediaEpisodesWatchedList)

  }

  async function fetchEpisodesFromSource(newSourceChose: SourceType["source"]) {

    setIsLoading(true)

    const paginationEndOffset = itemOffset + rangeEpisodesPerPage

    let mediaEpisodesList: EpisodeAnimeWatch[] | MediaEpisodes[]

    switch (newSourceChose) {

      case "crunchyroll":

        setCurrEpisodesSource(newSourceChose)

        setEpisodesList(crunchyrollInitialEpisodes)

        setCurrAnimesList(crunchyrollInitialEpisodes.slice(itemOffset, paginationEndOffset))

        setPageNumber(Math.ceil(crunchyrollInitialEpisodes.length / rangeEpisodesPerPage))

        break

      case "gogoanime":

        setCurrEpisodesSource(newSourceChose)

        mediaEpisodesList = await optimizedFetchOnGoGoAnime({ textToSearch: mediaInfo.title.romaji, only: "episodes", isDubbed: isEpisodesDubbed }) as MediaEpisodes[]

        if (!mediaEpisodesList) {

          setIsLoading(false)

          setEpisodesList([])

          setCurrAnimesList(null)

          setPageNumber(0)

          return

        }

        setEpisodesList(mediaEpisodesList as MediaEpisodes[])

        setCurrAnimesList((mediaEpisodesList as MediaEpisodes[]).slice(itemOffset, paginationEndOffset))

        setPageNumber(Math.ceil((mediaEpisodesList as MediaEpisodes[]).length / rangeEpisodesPerPage))

        break

      case "aniwatch":

        setCurrEpisodesSource(newSourceChose)

        const searchResultsListForCurrMedia = await optimizedFetchOnAniwatch({
          textToSearch: mediaInfo.title.romaji,
          only: "search_list",
          format: mediaInfo.format,
          mediaTotalEpisodes: imdb.episodesList.length
        }) as MediaInfoAniwatch[]

        setMediaResultsInfoArray(searchResultsListForCurrMedia)

        mediaEpisodesList = await optimizedFetchOnAniwatch({
          textToSearch: mediaInfo.title.romaji,
          only: "episodes",
          format: mediaInfo.format,
          mediaTotalEpisodes: imdb.episodesList.length

        }) as EpisodesFetchedAnimeWatch["episodes"]

        setEpisodesList(mediaEpisodesList)

        if (mediaEpisodesList) {

          setCurrAnimesList(mediaEpisodesList.slice(itemOffset, paginationEndOffset))

          setPageNumber(Math.ceil(mediaEpisodesList.length / rangeEpisodesPerPage))

        }
        else {

          setCurrAnimesList(null)

          setPageNumber(0)

        }

        break

      default:

        alert("need to work on it. give me a shoutout on Git Issues if i forget")

        break

    }

    setIsLoading(false)

  }

  async function handleRefetchMediaEpisodesFromSelectTag(id: string) {

    setIsLoading(true)

    const endOffset = itemOffset + rangeEpisodesPerPage

    const mediaEpisodes = await aniwatch.getEpisodes({ episodeId: id }) as EpisodesFetchedAnimeWatch

    setEpisodesList(mediaEpisodes.episodes)

    setCurrAnimesList(mediaEpisodes.episodes.slice(itemOffset, endOffset));
    setPageNumber(Math.ceil(mediaEpisodes.episodes.length / rangeEpisodesPerPage));

    setIsLoading(false)

  }

  async function handleButtonPageNavigation(event: { selected: number }) {

    setIsLoading(true) // Needed to refresh episodes "Marked as Watched"

    const newOffset = event.selected * rangeEpisodesPerPage % episodesList.length

    setItemOffset(newOffset)

    setTimeout(() => setIsLoading(false), 250)  // Needed to refresh episodes "Marked as Watched"

  }

  const handleSourcesButtonValue: (parameter: SourceType["source"]) => void = async (parameter: SourceType["source"]) => {

    setCurrEpisodesSource(parameter)

    fetchEpisodesFromSource(parameter)

  }

  return (
    <React.Fragment>

      <div id={styles.episodes_heading}>
        <h2 className={styles.heading_style}>EPISODES</h2>

        <OptionsPanel
          callDubbedFunction={() => setIsEpisodesDubbed(!isEpisodesDubbed)}
          dubbedStateValue={isEpisodesDubbed}
          user={user}
          db={db}
          mediaInfo={mediaInfo}
          imdb={imdb}
        />

      </div>

      <div>

        <div id={styles.container_heading}>

          <NavigationButtons
            propsFunction={handleSourcesButtonValue as (parameter: string | number) => void}
            currValue={currEpisodesSource}
            showSourceStatus
            sepateBtnsWithSpan={true}
            buttonOptions={[
              { name: "Crunchyroll", value: "crunchyroll" },
              { name: "GoGoAnime", value: "gogoanime" },
              { name: "Aniwatch", value: "aniwatch" }
            ]}
          />

          {/* SHOWS A SELECT WITH OTHER RESULTS FOR THIS MEDIA, ANIWATCH DONT GET THE RIGHT RESULT MOST OF TIMES */}
          <AnimatePresence>
            {(currEpisodesSource == "aniwatch" && mediaResultsInfoArray.length > 1) && (
              <motion.div
                id={styles.select_media_container}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >

                <small>Wrong Episodes? Select bellow!</small>

                <select
                  onChange={(e) => handleRefetchMediaEpisodesFromSelectTag(e.target.value)}
                  defaultValue={checkAnilistTitleMisspelling(mediaInfo.title.romaji || mediaInfo.title.native).toLowerCase()}
                >
                  {mediaResultsInfoArray?.map((media, key) => (
                    <option
                      key={key}
                      value={media.id.toLowerCase()}
                    >
                      {media.name}
                    </option>
                  ))}
                </select>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <motion.ol id={styles.container} data-loading={isLoading} animate={{ height: "auto" }}>

          <AnimatePresence>

            {currAnimesList && currAnimesList.map((episode: EpisodesType | MediaEpisodes | EpisodeAnimeWatch | ImdbEpisode, key) => (

              !isLoading && (
                <EpisodeBySource
                  key={key}
                  index={key}
                  episodeInfo={episode}
                  mediaInfo={mediaInfo}
                  currEpisodesSource={currEpisodesSource}
                  imdb={imdb}
                  crunchyrollInitialEpisodes={crunchyrollInitialEpisodes}
                  itemOffset={itemOffset}
                  currEpisodesWatched={currEpisodesWatched}
                  useDubbedRoute={isEpisodesDubbed}
                />
              )

            ))}

          </AnimatePresence>
        </motion.ol>

        {isLoading && (
          <motion.div
            id={styles.loading_episodes_container}
            variants={framerMotionLoadingEpisodes}
            initial="initial"
            animate="animate"
            exit="exit"
          >

            {simulateRange(rangeEpisodesPerPage).map((item, key) => (

              <motion.div
                key={key}
                variants={framerMotionLoadingEpisodes}
              >

                <LoadingSvg width={60} height={60} alt="Loading Episodes" />

              </motion.div>

            ))}

          </motion.div>
        )}

        {((episodesList?.length == 0 || episodesList == null) && !isLoading) && (
          <div id={styles.no_episodes_container}>

            <Image src={ErrorImg} alt='Error' height={200} />

            <p>Not available on <span>{currEpisodesSource}</span></p>

          </div>
        )}

        <nav id={styles.pagination_buttons_container}>

          <NavPaginateItems
            onPageChange={handleButtonPageNavigation}
            pageCount={pageNumber}
            redirectToPage={Number(currSearchParams.get("page")) || 0}
          />

        </nav>

      </div>
    </React.Fragment >
  )
}

function OptionsPanel({ user, db, mediaInfo, imdb, callDubbedFunction, dubbedStateValue }: {
  user: User | null | undefined,
  db: Firestore,
  imdb: {
    mediaSeasons: ImdbMediaInfo["seasons"],
    episodesList: ImdbEpisode[],
  },
  mediaInfo: ApiDefaultResult | ApiMediaResults,
  callDubbedFunction: () => void,
  dubbedStateValue: boolean
}) {

  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false)
  const [allEpisodesWatched, setAllEpisodesWatched] = useState<boolean>(false)

  const [isDubActive, setIsDubActive] = useState(false)

  useEffect(() => { setIsDubActive(dubbedStateValue) }, [dubbedStateValue])

  async function toggleOpenOptionsModal() {

    setIsOptionsModalOpen(!isOptionsModalOpen)

    if (!user) return

    const userDoc = await getDoc(doc(db, 'users', user!.uid)).then((res) => res.data())

    if (userDoc!.episodesWatched[mediaInfo.id]?.length == imdb.episodesList?.length) {
      setAllEpisodesWatched(true)
    }

    setAllEpisodesWatched(false)

  }

  async function handleMarkAllEpisodesAsWatched() {

    if (!user) return

    function mapAllEpisodesInfo(index: number) {

      return {
        mediaId: mediaInfo.id,
        episodeNumber: index + 1,
        episodeTitle: imdb.episodesList[index]?.title
      }

    }

    const allEpisodes: { mediaId: number, episodeNumber: number, episodeTitle: string }[] = []

    imdb.episodesList.map((episode, key) => allEpisodes.push(mapAllEpisodesInfo(key)))

    await setDoc(doc(db, 'users', user.uid),
      {
        episodesWatched: {
          [mediaInfo.id]: allEpisodesWatched ? null : allEpisodes
        }

      } as unknown as FieldPath,
      { merge: true }
    ).then(() =>
      setAllEpisodesWatched(!allEpisodesWatched)
    )

  }

  function handleDubbedInputValueChange() {

    localStorage.setItem("dubEpisodes", dubbedStateValue ? "false" : "true")

    callDubbedFunction()

  }

  return (
    <div id={styles.option_container}>

      <div id={styles.dub_input_container}>

        <label>

          <input
            type='checkbox'
            name="isDubbed"
            checked={isDubActive}
            aria-label='Dubbed Episodes'
            onChange={() => handleDubbedInputValueChange()}
          />
          <span />

        </label>

        <p>Dubbed</p>

      </div>

      <button
        id={styles.options_btn}
        onClick={() => toggleOpenOptionsModal()}
        data-active={isOptionsModalOpen}
        aria-controls={styles.episodes_options_panel}
        aria-label={isOptionsModalOpen ? `Close Options Menu` : `Open Options Menu`}

      >
        <DotsSvg width={16} height={16} />
      </button>

      <AnimatePresence>
        {isOptionsModalOpen && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id={styles.episodes_options_panel}
            aria-expanded={isOptionsModalOpen}
            className={styles.options_modal_container}
          >

            <h5>OPTIONS</h5>

            <ul>
              <li>
                <motion.button
                  onClick={() => handleMarkAllEpisodesAsWatched()}
                  whileTap={{ scale: 0.9 }}
                >
                  <CheckFillSvg width={16} height={16} /> {allEpisodesWatched ? "Unmark" : "Mark"} All Episodes as Watched
                </motion.button>
              </li>
            </ul>

          </motion.div>

        )}
      </AnimatePresence>

    </div>
  )

}

function EpisodeBySource({ episodeInfo, currEpisodesSource, currEpisodesWatched, itemOffset, mediaInfo, index, imdb, crunchyrollInitialEpisodes, useDubbedRoute }: {
  episodeInfo: ImdbEpisode | EpisodesType | MediaEpisodes | EpisodeAnimeWatch,
  currEpisodesSource: SourceType["source"],
  currEpisodesWatched?: {
    mediaId: number;
    episodeNumber: number;
    episodeTitle: string;
  }[],
  itemOffset: number,
  mediaInfo: ApiDefaultResult | ApiMediaResults,
  index: number,
  imdb: EpisodesContainerTypes["imdb"],
  crunchyrollInitialEpisodes: EpisodesContainerTypes["crunchyrollInitialEpisodes"],
  useDubbedRoute: boolean
}) {

  switch (currEpisodesSource) {

    case "crunchyroll":

      return (

        <CrunchyrollEpisode
          motionStyle={framerMotionEpisodePopup}
          key={index}
          episodeInfo={episodeInfo as EpisodesType}
          episodeNumber={index + itemOffset + 1}
          mediaId={mediaInfo.id}
          episodesWatchedInfo={currEpisodesWatched}
        />

      )

    case "gogoanime":

      return (

        <GoGoAnimeEpisode
          motionStyle={framerMotionEpisodePopup}
          key={index}
          episodeInfo={episodeInfo as MediaEpisodes}
          episodeNumber={index + itemOffset + 1}
          episodeTitle={imdb.episodesList[index + itemOffset]?.title}
          episodeDescription={imdb.episodesList[index + itemOffset]?.description || undefined}
          backgroundImg={imdb.episodesList[index + itemOffset]?.img?.hd || crunchyrollInitialEpisodes[index + itemOffset]?.thumbnail}
          mediaId={mediaInfo.id}
          episodesWatchedInfo={currEpisodesWatched}
          useDubbedRoute={useDubbedRoute}
        />

      )

    case "aniwatch":

      return (

        <AniwatchEpisode
          motionStyle={framerMotionEpisodePopup}
          key={index}
          episodeInfo={episodeInfo as EpisodeAnimeWatch}
          episodeNumber={index + itemOffset + 1}
          episodeDescription={imdb.episodesList[index + itemOffset]?.description || undefined}
          episodeImg={imdb.episodesList[index + itemOffset]?.img?.hd || crunchyrollInitialEpisodes[index + itemOffset]?.thumbnail}
          mediaId={mediaInfo.id}
          episodesWatchedInfo={currEpisodesWatched}
          useDubbedRoute={useDubbedRoute}
        />

      )

    default:
      return (<></>)

  }

}