"user client"
import React, { useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import MediaFormatIcon from '../MediaFormatIcon'
import DeleteSvg from "@/public/assets/trash.svg"
import { arrayRemove, doc, getFirestore, FieldPath, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initFirebase } from '@/firebase/firebaseApp'
import { AnimatePresence, motion } from 'framer-motion'
import fallbackImg from '@/public/photo-placeholder.jpg'

type ComponentTypes = {
    data: KeepWatchingItem,
    darkMode?: boolean,
    hiddenOnDesktop?: boolean,
    fromOfflineDb?: boolean
}

function EpisodeCoverInfo({ data, darkMode }: ComponentTypes) {

    const [wasDeleted, setWasDeleted] = useState<boolean>(false)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    async function removeFromKeepWatching() {

        await setDoc(doc(db, 'users', user!.uid),
            {
                keepWatching: {
                    [data.id]: arrayRemove(...[data])
                }
            } as unknown as FieldPath,
            { merge: true }

        )

        setWasDeleted(true)

    }

    return (
        <AnimatePresence>
            {!wasDeleted && (
                <motion.div
                    className={`${styles.media_item_container} ${darkMode ? styles.darkMode : ''}`}
                    data-deleted={wasDeleted}
                    animate={{ transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, scale: 0 }}
                >
                    <div id={styles.img_container}>

                        <Image
                            title={data.title.romaji}
                            src={data.episodeImg || fallbackImg}
                            placeholder='blur'
                            blurDataURL="https://upload.wikimedia.org/wikipedia/commons/8/8d/ERR0R_NO_IMAGE_FOUND.jpg"
                            alt={data.title && data.title.romaji || "Not Available"}
                            fill
                            sizes='(max-width: 324px) 100vw, (max-width: 495px) 50vw, (max-width: 1025px) 200px, (max-width: 1479px) 180px, 174px'
                        ></Image>

                        <span className={styles.media_type_icon}>

                            <MediaFormatIcon format={data.format} />

                            <span className={styles.media_format_title}>
                                {data.format == "TV" ? "ANIME" : data.format}
                            </span>

                        </span>

                        <div className={styles.overlay_info_container}>

                            <Link href={`/watch/${data.id}?source=${data.source}&episode=${data.episode}&q=${data.episodeId}&t=${data.episodeTimeLastStop || 0}`}>
                                {data.format != "MOVIE" ? "CONTINUE EPISODE" : "CONTINUE"}
                            </Link>

                        </div>

                        {data.format != "MOVIE" && (

                            <span className={styles.episode_name_span}>Episode {data.episode}</span>

                        )}

                        <motion.div
                            className={styles.progress_bar}
                        >
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: (((data.episodeTimeLastStop / data.episodeDuration) * 100) / 100) || 0.005 }}
                                transition={{ duration: 1 }}
                            />
                        </motion.div>

                    </div>

                    <div className={styles.info_bottom}>
                        <Link
                            href={`/media/${data.id}`}
                        >
                            {data.title && data.title.romaji}
                        </Link>

                        <button onClick={() => removeFromKeepWatching()} title={`Remove ${data.title.romaji} from Keep Watching`}>

                            <DeleteSvg width={16} height={16} alt="Delete" />

                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence >
    )

}

export default EpisodeCoverInfo