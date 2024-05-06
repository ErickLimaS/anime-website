"use client"
import React, { useEffect, useState } from 'react'
import CheckSvg from "@/public/assets/check-circle.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    DocumentData, DocumentSnapshot,
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
    hasText?: boolean
}

function MarkChapterAsReadButton({ chapterNumber, chapterTitle, mediaId, hasText }: BtnTypes) {

    const [wasChapterRead, setWasChapterRead] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // CHECK IF CHAPTER WAS ADDED ON FIRESTORE, THEN CHANGE STATE
    async function wasChapterMarkedAsRead() {

        if (!user) return

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user.uid))

        const chapterRead = userDoc.get("chaptersRead")[mediaId]?.find(
            (item: { chapterNumber: number }) => item.chapterNumber == chapterNumber
        )

        if (chapterRead) setWasChapterRead(true)

    }

    // ADD OR REMOVE CHAPTER FROM FIRESTORE
    async function addOrRemoveChapterRead() {

        if (!user) return

        setIsLoading(true)

        const episodeData = {

            mediaId: mediaId,
            chapterNumber: chapterNumber,
            chapterTitle: chapterTitle

        }

        await setDoc(doc(db, 'users', user.uid),
            {
                chaptersRead: {
                    [mediaId]: !wasChapterRead ? arrayUnion(...[episodeData]) : arrayRemove(...[episodeData])
                }
            } as unknown as FieldPath,
            { merge: true }
        )

        if (!wasChapterRead) setWasChapterRead(true)
        else setWasChapterRead(false)

        setIsLoading(false)
    }

    useEffect(() => {

        if (!user) return

        wasChapterMarkedAsRead()

    }, [user, chapterNumber])

    return (

        user && (
            <div className={styles.button_container}>

                <motion.button
                    onClick={() => addOrRemoveChapterRead()}
                    data-active={wasChapterRead}
                    disabled={isLoading}
                    title={wasChapterRead ? "Mark as Unread" : "Mark as Read "}
                >
                    {wasChapterRead ? (
                        <CheckFillSvg width={16} height={16} alt="Check Chapter as Read" />
                    ) : (
                        <CheckSvg width={16} height={16} alt="Check Chapter as Unread" />
                    )}

                </motion.button>

                <AnimatePresence>
                    {(hasText && wasChapterRead) && (
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
            </div>
        )

    )
}

export default MarkChapterAsReadButton