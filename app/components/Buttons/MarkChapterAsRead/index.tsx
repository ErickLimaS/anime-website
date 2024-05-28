"use client"
import React, { useEffect, useState } from 'react'
import CheckSvg from "@/public/assets/check-circle.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    FieldPath, arrayRemove,
    arrayUnion, doc,
    getDoc, getFirestore, setDoc
} from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'

type BtnTypes = {
    chapterNumber: number,
    chapterTitle: string,
    mediaId: number,
    showAdditionalText?: boolean
}

export default function MarkChapterAsReadButton({ chapterNumber, chapterTitle, mediaId, showAdditionalText }: BtnTypes) {

    const [wasChapterRead, setWasChapterRead] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    useEffect(() => {

        if (!user) return

        wasChapterPreviouslyMarkedAsRead()

    }, [user, chapterNumber])

    async function wasChapterPreviouslyMarkedAsRead() {

        if (!user) return

        const userDoc = await getDoc(doc(db, 'users', user.uid))

        const chapterRead = userDoc.get("chaptersRead")[mediaId]?.find(
            (item: { chapterNumber: number }) => item.chapterNumber == chapterNumber
        )

        if (chapterRead) setWasChapterRead(true)

    }

    async function handleChapterReadAction() {

        if (!user) return

        setIsLoading(true)

        const mangaChapterInfo = {

            mediaId: mediaId,
            chapterNumber: chapterNumber,
            chapterTitle: chapterTitle

        }

        await setDoc(doc(db, 'users', user.uid),
            {
                chaptersRead: {
                    [mediaId]: !wasChapterRead ? arrayUnion(...[mangaChapterInfo]) : arrayRemove(...[mangaChapterInfo])
                }
            } as unknown as FieldPath,
            { merge: true }
        ).then(() => {

            setWasChapterRead(!wasChapterRead)

        })

        setIsLoading(false)

    }

    return (
        user && (
            <div className={styles.button_container}>

                <motion.button
                    onClick={() => handleChapterReadAction()}
                    data-active={wasChapterRead}
                    disabled={isLoading}
                    title={wasChapterRead ? "Mark as Unread" : "Mark as Read"}
                >

                    <SvgIcons
                        wasChapterRead={wasChapterRead}
                    />

                </motion.button>

                <AuxTextAnimated
                    wasChapterRead={wasChapterRead}
                    showAdditionalText={showAdditionalText}
                />

            </div>
        )
    )
}

function SvgIcons({ wasChapterRead }: { wasChapterRead: boolean }) {

    if (wasChapterRead) {
        return (<CheckFillSvg width={16} height={16} alt="Check Chapter as Read" />)
    }

    return (<CheckSvg width={16} height={16} alt="Check Chapter as Unread" />)

}

function AuxTextAnimated({ showAdditionalText, wasChapterRead }: { wasChapterRead: boolean, showAdditionalText?: boolean }) {

    return (
        <AnimatePresence>
            {(showAdditionalText && wasChapterRead) && (
                <motion.span
                    className={styles.text_span}
                    initial={{ opacity: 0, y: "10px" }}
                    animate={{ opacity: 1, y: "0", transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, y: "10px" }}
                >
                    Read
                </motion.span>
            )}
        </AnimatePresence>
    )

}