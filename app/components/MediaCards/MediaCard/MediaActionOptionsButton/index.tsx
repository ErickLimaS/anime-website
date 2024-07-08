"use client"
import React, { useEffect, useState } from 'react'
import styles from "../component.module.css"
import styles2 from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import PlusSvg from "@/public/assets/plus-lg.svg"
import FavouriteSvgFill from "@/public/assets/heart-fill.svg"
import FavouriteSvg from "@/public/assets/heart.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import XSvg from "@/public/assets/x.svg"
import CheckSvg from "@/public/assets/check-circle.svg"
import { ApiDefaultResult, ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import * as AddToFavourites from '@/app/components/Buttons/AddToFavourites'
import { userMediaStatusEntries } from '@/app/lib/dataConstants/anilist'
import anilistUsers from '@/app/api/anilistUsers'
import { initFirebase } from '@/app/firebaseApp'
import { useAppSelector } from '@/app/lib/redux/hooks'
import { removeMediaOnListByStatus, updateUserMediaListByStatus } from '@/app/lib/user/userDocUpdateOptions'
import { getAuth } from 'firebase/auth'
import { getFirestore, getDoc, doc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import ShowUpLoginPanelAnimated from '@/app/components/UserLoginModal/animatedVariant'

const framerMotionOpenPanelTransition = {
    initial: {
        opacity: 0,
        y: 100
    },
    animate: {
        opacity: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        y: 100
    }
}

type StatusTypes = "COMPLETED" | "CURRENT" | "PLANNING" | "DROPPED" | "PAUSED" | "REPEATING"

export default function MediaActionOptionsButton({ mediaInfo }: { mediaInfo: ApiDefaultResult }) {

    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)


    console.log(mediaInfo)

    return (
        <React.Fragment>

            <div className={styles.options_btn_container}>

                <motion.button
                    aria-label={isPanelOpen ? "Close Options" : "Open Options"}
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    <PlusSvg fill="var(--brand-color)" />
                </motion.button>

            </div>

            <AnimatePresence>
                {isPanelOpen && (
                    <OptionsPanel
                        isPanelOpen={isPanelOpen}
                        setIsPanelOpen={setIsPanelOpen}
                        isFavourite={mediaInfo.isFavourite ? mediaInfo.isFavourite : false}
                        mediaListEntryInfo={mediaInfo.mediaListEntry || null}
                        mediaTitle={mediaInfo.title}
                        mediaInfo={mediaInfo}
                        amountWatchedOrRead={0}
                    />
                )}
            </AnimatePresence>

        </React.Fragment>
    )
}

function OptionsPanel({ isPanelOpen, setIsPanelOpen, isFavourite, mediaListEntryInfo, mediaTitle, mediaInfo, amountWatchedOrRead }: {
    isPanelOpen: boolean,
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isFavourite: boolean | undefined,
    mediaListEntryInfo: ApiDefaultResult["mediaListEntry"] | null,
    mediaTitle: ApiDefaultResult["title"],
    mediaInfo: ApiDefaultResult,
    amountWatchedOrRead?: number,
}) {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [mediaStatus, setMediaStatus] = useState<StatusTypes | null>(mediaListEntryInfo?.status || null)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const anilistUser = useAppSelector((state) => (state.UserInfo).value)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    useEffect(() => {

        if (!mediaInfo.mediaListEntry?.status && user) {

            isMediaOnUserDoc()

        }

    }, [mediaListEntryInfo?.status])

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnUserDoc() {

        if (!user) return

        const userMediaLists = await getDoc(doc(db, "users", user.uid)).then(
            (res) => res.data()?.mediaListSavedByStatus
        )

        if (!userMediaLists) return

        userMediaStatusEntries.map((btn) => {

            const wasMediaFound = userMediaLists[btn.value.toLowerCase()]?.find((media: { id: number }) => media.id == mediaInfo.id)

            if (wasMediaFound) setMediaStatus(btn.value as StatusTypes)

        })

    }

    async function handleAddMediaOnList({ status }: { status: StatusTypes }) {

        // Opens Login Modal
        if (!user && !anilistUser) return setIsUserModalOpen(true)

        setIsLoading(true)

        const mediaData = {
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

        // Remove from curr list
        if (mediaStatus) {

            const userMediaList = await getDoc(doc(db, "users", user?.uid || `${anilistUser?.id}`)).then(
                (res) => res.data()?.mediaListSavedByStatus[mediaStatus.toLowerCase()]
            )

            const filterNewList = userMediaList.filter((media: { id: number }) => media.id != mediaInfo.id)

            await removeMediaOnListByStatus({
                newListFiltered: filterNewList,
                status: mediaStatus,
                userId: user?.uid || `${anilistUser?.id}`
            })

            // Remove from anilist list
            if (anilistUser && (mediaStatus?.toLowerCase() == status.toLowerCase())) {

                await anilistUsers.removeMediaFromSelectedList({
                    listItemEntryId: mediaListEntryInfo?.id!
                })

                setIsLoading(false)

                setMediaStatus(null)

                return

            }

        }

        await updateUserMediaListByStatus({
            status: status,
            userId: user?.uid || `${anilistUser?.id}`,
            mediaData: mediaData,
        })

        if (anilistUser) {
            await anilistUsers.addMediaToSelectedList({
                status: status,
                mediaId: mediaInfo.id,
                episodeOrChapterNumber: status == "COMPLETED" ? mediaInfo.episodes : amountWatchedOrRead || 0,
                numberWatchedOrReadUntilNow: amountWatchedOrRead || 0
            })
        }

        setIsLoading(false)

        setMediaStatus(status)

    }

    return (
        <>
            <ShowUpLoginPanelAnimated
                apperanceCondition={isUserModalOpen}
                customOnClickAction={() => setIsUserModalOpen(false)}
                auth={auth}
            />

            <motion.div
                className={styles2.options_panel_overlay}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                variants={framerMotionOpenPanelTransition}
                initial="initial"
                animate="animate"
                exit="exit"
            >

                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className={styles2.options_panel}
                >

                    <div className={styles2.panel_heading}>
                        <h5>{mediaTitle.userPreferred}</h5>

                        <motion.button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            whileTap={{ scale: 0.9 }}
                            aria-label='Close Menu'
                        >
                            <XSvg />
                        </motion.button>
                    </div>

                    <ul>
                        <li>
                            <AddToFavourites.Button
                                isActiveOnAnilist={isFavourite}
                                mediaInfo={mediaInfo}
                                customText={isFavourite ? "On Favourites" : "Add to Favourites"}
                            >

                                <AddToFavourites.SvgIcon>
                                    <FavouriteSvg fill="var(--brand-color)" />
                                </AddToFavourites.SvgIcon>

                                <AddToFavourites.SvgIcon>
                                    <FavouriteSvgFill fill="var(--brand-color)" />
                                </AddToFavourites.SvgIcon>

                            </AddToFavourites.Button>
                        </li>
                        {userMediaStatusEntries.map((btn) => (
                            <li key={btn.value}>
                                <motion.button
                                    data-active={mediaStatus == btn.value}
                                    disabled={isLoading}
                                    onClick={() => handleAddMediaOnList(
                                        { status: btn.value as StatusTypes }
                                    )}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {mediaStatus == btn.value ?
                                        <><CheckFillSvg /> Setted as {btn.name}</>
                                        :
                                        <><CheckSvg /> Set as {btn.name}</>
                                    }
                                </motion.button>
                            </li>
                        ))}
                    </ul>

                </motion.div>

            </motion.div>
        </>
    )

}