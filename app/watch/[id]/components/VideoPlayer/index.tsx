"use client"
import styles from "./component.module.css"
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import { initFirebase } from '@/firebase/firebaseApp';
import { getAuth } from 'firebase/auth';
import {
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

type VideoPlayerType = {
    source: string,
    currentLastStop?: string,
    mediaSource: string,
    media: ApiMediaResults,
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

function Player({ source, mediaSource, subtitles, videoQualities, media, episodeId, episodeNumber, currentLastStop, episodeIntro, episodeOutro }: VideoPlayerType) {

    const [subList, setSubList] = useState<SubtitlesType[] | undefined>(undefined)

    const [episodeLastStop, setEpisodeLastStop] = useState<number>(Number(currentLastStop) || 0)

    const [timeskip, setTimeskip] = useState<number | null>(null)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const [videoSource, setVideoSource] = useState<string>()

    const db = getFirestore(initFirebase());

    // get user preferred languag
    async function getUserPreferedLanguage() {

        let preferredLanguage: string | null = null

        if (user) {

            const data = await getDoc(doc(db, "users", user.uid))

            preferredLanguage = await data.get("videoSubtitleLanguage")

        }

        // get user language and filter through the available subtitles to this media
        let subListMap: SubtitlesType[] = []

        subtitles?.map((item) => {

            const isDefaultLang = (preferredLanguage && item.label) ?
                item.label.toLowerCase().includes(preferredLanguage.toLowerCase())
                :
                item.default || item.label == "English"

            subListMap.push({
                kind: item.kind,
                srcLang: item.label,
                src: item.file,
                default: isDefaultLang,
                label: item.label,
                type: item.kind
            })

        })

        setSubList(subListMap)
    }

    // get user preferred quality
    async function getUserVideoQuality() {

        let userVideoQuality: string | null = null

        if (user) {

            const data = await getDoc(doc(db, "users", user.uid))

            userVideoQuality = await data.get("videoQuality")

        }

        if (!userVideoQuality) return setVideoSource(source)

        // get which that matches the available qualities of this media
        let videoSourceMatchedUserQuality

        videoQualities?.map((item) => {

            if (userVideoQuality == item.quality) videoSourceMatchedUserQuality = item.url

        })

        setVideoSource(videoSourceMatchedUserQuality || source)
    }

    // gets last time position of episode
    async function getUserLastStopOnCurrentEpisode() {

        if (!user || currentLastStop) return

        let keepWatchingList = await getDoc(doc(db, 'users', user.uid)).then(doc => doc.get("keepWatching"))

        let listFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = listFromObjectToArray
            .filter(item => item.length != 0 && item)
            .find((item: KeepWatchingItem) => item.id == media.id)

        if (keepWatchingList) return setEpisodeLastStop(keepWatchingList.episodeTimeLastStop)

    }

    // adds media to keep watching
    // updates DOC every 30 secs
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
            }
            else if (episodeOutro && currentTime >= episodeOutro.start && currentTime < episodeOutro.end) {
                if (timeskip == null) setTimeskip(() => episodeOutro.end)
            }
            else {
                setTimeskip(null)
            }
        }

        if (user && (currentTime % 30 === 0)) {
            addToKeepWatching(currentTime, duration)
        }

    }

    function skipEpisodeIntroOrOutro() {

        setEpisodeLastStop(timeskip as number)
        setTimeskip(null)

    }

    useEffect(() => {

        getUserPreferedLanguage()
        getUserVideoQuality()
        getUserLastStopOnCurrentEpisode()

    }, [user, loading, source])

    return (
        (!loading && subList && videoSource) && (
            <MediaPlayer
                className={styles.container}
                title={media.title.romaji}
                src={videoSource}
                currentTime={episodeLastStop}
                autoPlay
                volume={0.5}
                onProgressCapture={(e) => checkSecondsAndSetSkipAndNextEpisode(e.target)}
                onEnded={() => console.log("aaaa")}
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
                            Skip
                        </motion.button>

                    )}
                </AnimatePresence>

                <MediaProvider >
                    {subList.map((item) => (
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