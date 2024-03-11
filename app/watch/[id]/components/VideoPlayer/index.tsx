"use client"
import { initFirebase } from '@/firebase/firebaseApp';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactPlayer from 'react-player';
import { TrackProps } from 'react-player/file';

function Player({ source, subtitles }: { source: string, subtitles?: { kind: string, default: boolean | undefined, file: string, label: string }[] }) {

    const [subList, setSubList] = useState<TrackProps[] | undefined>(undefined)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    async function getUserPreferedLanguage() {

        let preferredLanguage = null

        if (user) {

            const data = await getDoc(doc(db, "users", user.uid))

            preferredLanguage = await data.get("videoSubtitleLanguage") as string

        }

        let subListMap: React.SetStateAction<TrackProps[] | undefined> = []

        subtitles?.map((item, key) => {

            const isDefaultLang = (preferredLanguage && subtitles[key].label) ?
                subtitles[key].label.toLowerCase().includes(preferredLanguage.toLowerCase())
                :
                subtitles[key].default || subtitles[key].label == "English"

            subListMap.push({
                kind: subtitles[key].kind,
                srcLang: subtitles[key].label,
                src: subtitles[key].file,
                default: isDefaultLang,
                label: subtitles[key].label
            })

        })

        setSubList(subListMap)
    }

    useEffect(() => {

        getUserPreferedLanguage()

    }, [user, loading])

    return (
        (!loading && subList) && (
            <ReactPlayer
                controls
                playing
                volume={0.6}
                url={source}
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