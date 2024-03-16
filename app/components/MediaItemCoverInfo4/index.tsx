"user client"
import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import MediaFormatIcon from '../MediaFormatIcon'
import DeleteSvg from "@/public/assets/trash.svg"
import { arrayRemove, doc, updateDoc, getFirestore, FieldPath, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initFirebase } from '@/firebase/firebaseApp'

type ComponentTypes = {
    data: KeepWatchingItem,
    darkMode?: boolean,
    loading?: boolean,
    hiddenOnDesktop?: boolean,
    fromOfflineDb?: boolean
}

function MediaItemCoverInfo4({ data, darkMode, loading }: ComponentTypes) {

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

    }

    return (
        <div
            className={`${styles.media_item_container} ${darkMode ? styles.darkMode : ''}`}
            data-loading={loading || false}
        >
            <Link
                id={styles.img_container}
                href={`/media/${data.id}`}
            >

                <Image
                    src={data.coverImage && data.coverImage.large
                    }
                    placeholder='blur'
                    blurDataURL="https://upload.wikimedia.org/wikipedia/commons/8/8d/ERR0R_NO_IMAGE_FOUND.jpg"
                    alt={`Cover Art for ${data.title && data.title.romaji || "Not Available"}`}
                    fill
                    sizes='100%'
                    title={data.title.romaji}
                ></Image>

                <span className={styles.media_type_icon}>

                    <MediaFormatIcon
                        format={data.format}
                    />

                    <span className={styles.media_format_title}>
                        {data.format == "TV" ? "ANIME" : data.format}
                    </span>

                </span>

                <span className={styles.episode_name_span}>Episode {data.episode}</span>

            </Link>

            <div className='display_flex_row align_items_center space_beetween'>
                <Link
                    href={`/media/${data.id}`}
                >
                    {data.title && data.title.romaji}
                </Link>

                <button onClick={() => removeFromKeepWatching()} title={`Remove from ${data.title.romaji} from Keep Watching`}>

                    <DeleteSvg width={16} height={16} alt="Delete" />

                </button>
            </div>
        </div >
    )

}

export default MediaItemCoverInfo4