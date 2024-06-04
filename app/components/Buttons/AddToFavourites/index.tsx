"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import FavouriteSvg from "@/public/assets/heart.svg"
import FavouriteFillSvg from "@/public/assets/heart-fill.svg"
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp'
import { getAuth } from 'firebase/auth'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import { motion } from 'framer-motion';
import ShowUpLoginPanelAnimated from '../../UserLoginModal/animatedVariant'
import { updateUserFavouriteMedias } from '@/app/lib/firebaseUserActions/userDocUpdateOptions'
import { useAppSelector } from '@/app/lib/redux/hooks'

export function Button({ mediaInfo, svgOnlyColor, children }: { mediaInfo: ApiDefaultResult, svgOnlyColor?: string, children?: React.ReactNode[] }) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wasAddedToFavourites, setWasAddedToFavourites] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const anilistUser = useAppSelector((state) => (state.UserInfo).value)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    useEffect(() => {

        if ((!user && !anilistUser) || loading) return

        setIsUserModalOpen(false)
        isMediaOnUserDoc()

    }, [user, anilistUser, loading])

    // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
    async function handleMediaOnUserDoc() {

        // Opens Login Modal
        if (!user && !anilistUser) return setIsUserModalOpen(true)

        setIsLoading(true)

        const favouriteMediaData = {
            id: mediaInfo.id,
            title: {
                romaji: mediaInfo.title.romaji
            },
            format: mediaInfo.format,
            description: mediaInfo.description,
            coverImage: {
                extraLarge: mediaInfo.coverImage.extraLarge,
                large: mediaInfo.coverImage.large
            }
        }

        await updateUserFavouriteMedias({
            userId: user?.uid || `${anilistUser?.id}`,
            mediaData: favouriteMediaData,
            isAddAction: !wasAddedToFavourites
        })

        wasAddedToFavourites ? setWasAddedToFavourites(false) : setWasAddedToFavourites(true)

        setIsLoading(false)

    }

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnUserDoc() {

        if (!user && !anilistUser) return

        const userDoc = await getDoc(doc(db, 'users', user?.uid || `${anilistUser?.id}`))

        const wasMediaIdFoundOnDoc = userDoc.get("bookmarks")?.find((item: { id: number }) => item.id == mediaInfo.id)

        if (wasMediaIdFoundOnDoc) setWasAddedToFavourites(true)

    }

    return (
        <React.Fragment>

            <ShowUpLoginPanelAnimated
                apperanceCondition={isUserModalOpen}
                customOnClickAction={() => setIsUserModalOpen(false)}
                auth={auth}
            />

            <motion.button
                whileTap={{ scale: 0.85 }}
                id={styles.container}
                className={children ? styles.custom_text : ""}
                onClick={() => handleMediaOnUserDoc()}
                disabled={isLoading}
                data-added={wasAddedToFavourites}
                data-unique-color={svgOnlyColor != undefined}
                aria-label={wasAddedToFavourites ? "Click To Remove from Favourites" : "Click To Add To Favourites"}
                title={wasAddedToFavourites ? `Remove ${mediaInfo.title && mediaInfo.title?.userPreferred} from Favourites` : `Add ${mediaInfo.title && mediaInfo.title?.userPreferred} To Favourites`}
            >

                {isLoading &&
                    (<LoadingSvg alt="Loading Icon" width={16} height={16} />)
                }

                {(!isLoading && wasAddedToFavourites) &&
                    (children ?
                        children[1] : (<><FavouriteFillSvg width={16} height={16} fill={svgOnlyColor || "var(--brand-color)"} /> FAVOURITED</>)
                    )
                }

                {(!isLoading && !wasAddedToFavourites) &&
                    (children ?
                        children[0] : (<><FavouriteSvg width={16} height={16} fill={svgOnlyColor || "var(--white-100)"} /> FAVOURITE</>)
                    )
                }

            </motion.button>

        </React.Fragment>
    )
}

export function SvgIcon({ children }: { children: React.ReactNode }) {

    return (children)

}