"use client"
import { initFirebase } from '@/firebase/firebaseApp';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactPlayer from 'react-player';
import { TrackProps } from 'react-player/file';

type VideoPlayerType = {
    source: string,
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

function Player({ source, subtitles, videoQualities }: VideoPlayerType) {

    const [subList, setSubList] = useState<TrackProps[] | undefined>(undefined)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const [videoSource, setVideoSource] = useState<string>()

    const db = getFirestore(initFirebase());

    async function getUserPreferedLanguage() {

        let preferredLanguage: string | null = null

        if (user) {

            const data = await getDoc(doc(db, "users", user.uid))

            preferredLanguage = await data.get("videoSubtitleLanguage")

        }

        // get user language and filter through the available subtitles to this media
        let subListMap: TrackProps[] = []

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
                label: item.label
            })

        })

        setSubList(subListMap)
    }

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

    useEffect(() => {

        getUserPreferedLanguage()
        getUserVideoQuality()

    }, [user, loading])

    return (
        (!loading && subList && videoSource) && (
            <ReactPlayer
                controls
                playing
                volume={0.6}
                url={videoSource}
                config={{
                    file: {
                        attributes: {
                            crossOrigin: "anonymous",
                        },
                        tracks: subList
                    }
                }}
            />
        )
    )
}

export default Player