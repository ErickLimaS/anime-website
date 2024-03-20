"use client"
import styles from "./component.module.css"
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import { initFirebase } from '@/firebase/firebaseApp';
import { getAuth } from 'firebase/auth';
import {
    DocumentData,
    DocumentSnapshot,
    FieldPath,
    doc, getDoc,
    getFirestore, setDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { CaptionsFileFormat, CaptionsParserFactory } from 'media-captions';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { AnimatePresence, motion } from "framer-motion";
import { EpisodeLinksGoGoAnime, MediaEpisodes } from "@/app/ts/interfaces/apiGogoanimeDataInterface";
import { EpisodeAnimeWatch, EpisodeLinksAnimeWatch } from "@/app/ts/interfaces/apiAnimewatchInterface";
import gogoanime from "@/api/gogoanime";
import aniwatch from "@/api/aniwatch";
import { useRouter } from "next/navigation";
import SkipSvg from "@/public/assets/chevron-double-right.svg"
import NextSvg from "@/public/assets/play.svg"

type VideoPlayerType = {
    source: string,
    currentLastStop?: string,
    mediaSource: string,
    media: ApiMediaResults,
    mediaEpisodes?: MediaEpisodes[] | EpisodeAnimeWatch[],
    episodeNumber: string,
    episodeId: string,
    episodeIntro?: { start: number, end: number },
    episodeOutro?: { start: number, end: number },
    subtitles?: {
        kind: string,
        default: boolean | undefined,
        file: string,
        label: string
    }[],
    videoQualities?: {
        url: string,
        quality: "360p" | "480p" | "720p" | "1080p" | "default" | "backup",
        isM3U8: boolean
    }[]
}

type SubtitlesType = {
    src: string | undefined,
    kind: string | TextTrackKind,
    label: string | undefined,
    srcLang: string | undefined,
    type: string | CaptionsParserFactory | undefined,
    default: boolean | undefined,
}

function Player({
    source, mediaSource, subtitles,
    videoQualities, media, episodeId,
    episodeNumber, currentLastStop, episodeIntro,
    episodeOutro, mediaEpisodes }: VideoPlayerType) {

    const [subList, setSubList] = useState<SubtitlesType[] | undefined>(undefined)

    const [nextEpisode, setNextEpisode] = useState<any | undefined>(undefined)

    const [showActionButtons, setShowActionButtons] = useState<boolean>(false)

    const [episodeLastStop, setEpisodeLastStop] = useState<number>(Number(currentLastStop) || 0)

    const [timeskip, setTimeskip] = useState<number | null>(null)

    const [videoSource, setVideoSource] = useState<string>(source)

    const [autoSkipIntroAndOutro, setAutoSkipIntroAndOutro] = useState<boolean>(false)
    const [autoNextEpisode, setAutoNextEpisode] = useState<boolean>(false)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    // get user preferences 
    async function getUserPreferences() {

        let userDoc = undefined
        if (user) userDoc = await getDoc(doc(db, "users", user.uid))

        getUserAutoSkip(userDoc)
        getUserPreferredLanguage(userDoc)
        getUserVideoQuality(userDoc)
        getUserLastStopOnCurrentEpisode(userDoc)

    }

    // get user Auto Skip and Auto Next Episode
    async function getUserAutoSkip(userDoc?: DocumentSnapshot<DocumentData, DocumentData>) {

        let userAutoSkipIntroAndOutro: boolean | null = null
        let userNextEpisode: boolean | null = null

        userAutoSkipIntroAndOutro = await userDoc?.get("autoSkipIntroAndOutro") == true || false
        userNextEpisode = await userDoc?.get("autoNextEpisode") == true || false

        setAutoSkipIntroAndOutro(userAutoSkipIntroAndOutro)
        setAutoNextEpisode(userNextEpisode)

    }

    // get user preferred language
    async function getUserPreferredLanguage(userDoc?: DocumentSnapshot<DocumentData, DocumentData>) {

        let preferredLanguage: string | null = null

        preferredLanguage = await userDoc?.get("videoSubtitleLanguage")

        // get user language and filter through the available subtitles to this media
        let subListMap: SubtitlesType[] = []

        subtitles?.map((item) => {

            const isDefaultLang = (preferredLanguage && item.label) ?
                item.label.toLowerCase().includes(preferredLanguage.toLowerCase())
                :
                item.default || item.label == "English"

            subListMap.push(
                {
                    kind: item.kind,
                    srcLang: item.label,
                    src: item.file,
                    default: isDefaultLang,
                    label: item.label,
                    type: item.kind
                }
            )

        })

        setSubList(subListMap)
    }

    // get user preferred quality
    async function getUserVideoQuality(userDoc?: DocumentSnapshot<DocumentData, DocumentData>) {

        let userVideoQuality: string | null = null

        // userVideoQuality = await userDoc?.get("videoQuality")

        if (!userVideoQuality) return setVideoSource(source)

        // get which that matches the available qualities of this media
        // let videoSourceMatchedUserQuality

        // videoQualities?.map((item) => {

        //     if (userVideoQuality == item.quality) videoSourceMatchedUserQuality = item.url

        // })

        // setVideoSource(videoSourceMatchedUserQuality || source)
    }

    // gets last time position of episode
    async function getUserLastStopOnCurrentEpisode(userDoc?: DocumentSnapshot<DocumentData, DocumentData>) {

        if (currentLastStop) return

        let keepWatchingList = userDoc?.get("keepWatching")

        let listFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = listFromObjectToArray
            .filter(item => item.length != 0 && item)
            .find((item: KeepWatchingItem) => item.id == media.id)

        if (keepWatchingList) return setEpisodeLastStop(keepWatchingList.episodeTimeLastStop)

    }

    // adds media to keep watching
    // updates DOC every 45 secs
    async function addToKeepWatching(currentEpisodeTime: number, videoDuration: number) {

        await setDoc(doc(db, "users", user!.uid),
            {
                keepWatching: {
                    [media.id]: {
                        id: media.id,
                        title: {
                            romaji: media.title.romaji
                        },
                        format: media.format,
                        coverImage: {
                            extraLarge: media.coverImage.extraLarge,
                            large: media.coverImage.large
                        },
                        episode: episodeNumber,
                        episodeId: episodeId,
                        episodeTimeLastStop: currentEpisodeTime,
                        episodeDuration: videoDuration,
                        source: mediaSource,
                        updatedAt: Date.parse(new Date(Date.now() - 0 * 24 * 60 * 60 * 1000) as any) / 1000
                    }
                }
            } as unknown as FieldPath,
            { merge: true }
        )

    }

    function checkSecondsAndSetSkipAndNextEpisode(e: any) {

        const currentTime = Math.round(e.currentTime)
        const duration = Math.round(e.duration)

        if (episodeIntro || episodeOutro) {
            if (episodeIntro && currentTime >= episodeIntro.start && currentTime < episodeIntro.end) {
                if (timeskip == null) setTimeskip(() => episodeIntro.end)
                if (user && autoSkipIntroAndOutro && timeskip != null) skipEpisodeIntroOrOutro()
            }
            else if (episodeOutro && currentTime >= episodeOutro.start && currentTime < episodeOutro.end) {
                if (timeskip == null) setTimeskip(() => episodeOutro.end)
                if (user && autoSkipIntroAndOutro && timeskip != null) skipEpisodeIntroOrOutro()
            }
            else {
                setTimeskip(null)
            }
        }

        // saves video progress on DB, when every 45 seconds passes
        if (user && (currentTime % 45 === 0)) addToKeepWatching(currentTime, duration)

        // show next episode button
        if (nextEpisode && Math.round((currentTime / duration) * 100) > 95) {
            setShowActionButtons(true)
        }
        else {
            if (showActionButtons != false) setShowActionButtons(false)
        }

    }

    function skipEpisodeIntroOrOutro() {

        setEpisodeLastStop(timeskip as number)
        setTimeskip(null)

    }

    // get video source to next episode
    async function getNextEpisode() {

        if (!mediaEpisodes) return

        let fetchNextEpisode: any = mediaEpisodes.find((item: { number: number; }) => item.number == (Number(episodeNumber) + 1))

        let nextEpisodId

        if (fetchNextEpisode) {

            if (mediaSource == "gogoanime") {

                nextEpisodId = (fetchNextEpisode as any).id

                fetchNextEpisode = await gogoanime.getLinksForThisEpisode(fetchNextEpisode.id) as EpisodeLinksGoGoAnime

                fetchNextEpisode = (fetchNextEpisode as EpisodeLinksGoGoAnime).sources.find(item => item.quality == "default").url

                if (!fetchNextEpisode) fetchNextEpisode = (fetchNextEpisode as EpisodeLinksGoGoAnime).sources[0].url

            }
            else {

                nextEpisodId = (fetchNextEpisode as EpisodeAnimeWatch).episodeId

                fetchNextEpisode = await aniwatch.episodesLinks(fetchNextEpisode.episodeId) as EpisodeLinksAnimeWatch

                fetchNextEpisode = fetchNextEpisode.sources[0].url

            }

        }

        if (nextEpisodId && fetchNextEpisode) setNextEpisode({ id: nextEpisodId, src: fetchNextEpisode })

    }

    function nextEpisodeAction() {

        router.push(`/watch/${media.id}?source=${mediaSource}&episode=${Number(episodeNumber) + 1}&q=${nextEpisode.id}`)
        setVideoSource(nextEpisode.src)

    }

    useEffect(() => {

        getUserPreferences()

    }, [user, loading, episodeId])


    useEffect(() => {

        getNextEpisode()

    }, [videoSource, episodeNumber])

    return (
        (!loading && subList) && (
            <MediaPlayer
                playsInline
                crossOrigin={"use-credentials"}
                className={styles.container}
                title={media.title.romaji}
                src={videoSource}
                currentTime={episodeLastStop}
                autoPlay
                volume={0.5}
                // saves state of video every 45 secs, and shows SKIP btn on intros/outros
                onProgressCapture={(e) => checkSecondsAndSetSkipAndNextEpisode(e.target)}
                // when video ends, goes to next episode                 
                onEnded={() => autoNextEpisode && nextEpisodeAction()}
            >

                <AnimatePresence>
                    {timeskip && (

                        <motion.button
                            id={styles.skip_btn}
                            onClick={() => skipEpisodeIntroOrOutro()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { animation: 1.5 } }}
                            exit={{ opacity: 0 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <SkipSvg width={16} height={16} /> {autoSkipIntroAndOutro ? "Auto Skip" : "Skip"}
                        </motion.button>

                    )}
                </AnimatePresence>

                {(nextEpisode && showActionButtons) && (

                    <motion.button
                        id={styles.next_episode_btn}
                        onClick={() => nextEpisodeAction()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { animation: 1.5 } }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NextSvg width={16} height={16} /> Next Episode
                    </motion.button>

                )}

                <MediaProvider >
                    {subList.map((item, key) => (
                        <Track
                            key={item.src}
                            src={item.src}
                            kind={item.kind as TextTrackKind}
                            label={item.label}
                            lang={item.srcLang}
                            type={item.kind as CaptionsFileFormat}
                            default={item.default}
                        />
                    ))}
                </MediaProvider>

                <DefaultVideoLayout
                    icons={defaultLayoutIcons}
                    thumbnails={media.bannerImage || undefined}
                />
            </MediaPlayer >
        )
    )
}

export default Player