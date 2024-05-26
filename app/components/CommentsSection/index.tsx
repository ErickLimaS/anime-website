"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import Image from 'next/image';
import {
    getFirestore, doc, arrayUnion, FieldPath, setDoc,
    DocumentData, QueryDocumentSnapshot,
    addDoc, collection, getDocs,
    where, query
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import { ApiDefaultResult, ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import Comment from './components/Comment';
import SvgCheck from "@/public/assets/check-circle-fill.svg"
import SvgLoading from "@/public/assets/ripple-1s-200px.svg"
import SvgFilter from "@/public/assets/filter-right.svg"
import UserModal from '@/app/components/UserLoginModal';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileFallbackImg from "@/public/profile_fallback.jpg"

type CommetsSectionTypes = {
    mediaInfo: ApiMediaResults | ApiDefaultResult,
    isOnWatchPage?: boolean,
    episodeId?: string,
    episodeNumber?: number
}

function CommentsSection({ mediaInfo, isOnWatchPage, episodeId, episodeNumber }: CommetsSectionTypes) {

    const [commentsList, setCommentsList] = useState<DocumentData[]>([])
    const [wasCommentCreatedSuccessfully, setWasCommentCreatedSuccessfully] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

    const [commentsSliceRange, setCommentsSliceRange] = useState<number>(3)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    useEffect(() => { getCommentsForCurrMedia() }, [mediaInfo, user, episodeId])

    function handleCommentsSliceRange() { setCommentsSliceRange(commentsSliceRange + 10) }

    async function handleCommentsSortBy(sortBy: "date" | "likes" | "dislikes", commentsUnsorted?: DocumentData[]) {

        setIsLoading(true)

        if (!commentsUnsorted) commentsUnsorted = await getCommentsForCurrMedia()

        let sortedComments

        switch (sortBy) {
            case "date":

                sortedComments = commentsUnsorted!.sort((x, y) => y.createdAt - x.createdAt)
                setCommentsList(sortedComments)

                break

            case "likes":

                sortedComments = commentsUnsorted!.sort((x, y) => y.likes - x.likes)
                setCommentsList(sortedComments)

                break

            case "dislikes":

                sortedComments = commentsUnsorted!.sort((x, y) => y.dislikes - x.dislikes)
                setCommentsList(sortedComments)

                break

            default:

                sortedComments = commentsUnsorted!.sort((x, y) => y.createdAt - x.createdAt)
                setCommentsList(sortedComments)

                break

        }

        setIsLoading(false)

    }

    async function getCommentsForCurrMedia() {

        setIsLoading(true)

        let mediaComments = await getDocs(collection(db, 'comments', `${mediaInfo.id}`, isOnWatchPage ? `${episodeId}` : "all"))

        if (!mediaComments) {

            await setDoc(doc(db, 'comments', `${mediaInfo.id}`), {})

            mediaComments = await getDocs(collection(db, 'comments', `${mediaInfo.id}`, isOnWatchPage ? `${episodeId}` : "all"))

            return

        }

        if (isOnWatchPage) {
            let commentsForCurrEpisode: DocumentData[] = []

            const queryCommentsToThisEpisode = query(collection(db, 'comments', `${mediaInfo.id}`, "all"), where("episodeNumber", "==", episodeNumber))

            const querySnapshot = await getDocs(queryCommentsToThisEpisode)

            querySnapshot.docs.forEach(doc => commentsForCurrEpisode.push(doc.data()))

            await handleCommentsSortBy("date", commentsForCurrEpisode)

            return
        }

        const mediaCommentsMapped = mediaComments.docs.map((doc: QueryDocumentSnapshot) => doc.data())

        await handleCommentsSortBy("date", mediaCommentsMapped)

        setIsLoading(false)

        return mediaCommentsMapped

    }

    async function handleCreateComment(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault()

        if (!user) return setIsUserModalOpen(true)

        const form = e.target as any

        if (form.comment.value == "") return

        setIsLoading(true)

        const commentTimeStamp = Math.floor(new Date().getTime() / 1000.0)

        const commentData = {

            userId: doc(db, "users", user.uid),
            username: user.displayName,
            userPhoto: user.photoURL,
            createdAt: commentTimeStamp,
            comment: form.comment.value,
            isSpoiler: form.spoiler.checked,
            likes: 0,
            dislikes: 0,
            fromEpisode: isOnWatchPage || null,
            episodeId: episodeId || null,
            episodeNumber: episodeNumber || null

        }

        const commentCreatedDoc = await addDoc(collection(db, 'comments', `${mediaInfo.id}`, "all"), commentData)

        if (commentCreatedDoc) {

            form.comment.value = ""
            setWasCommentCreatedSuccessfully(true)

            await setDoc(doc(db, 'users', user.uid), {
                comments: {
                    written: arrayUnion(...[{
                        commentRef: commentCreatedDoc.id,
                        media: {
                            id: mediaInfo.id,
                            coverImage: {
                                extraLarge: mediaInfo.coverImage.extraLarge
                            },
                            title: {
                                romaji: mediaInfo.title.romaji
                            }
                        }
                    }])
                }
            } as unknown as FieldPath, { merge: true })

        }

        if (isOnWatchPage) {
            await addDoc(collection(db, 'comments', `${mediaInfo.id}`, `${episodeNumber}`), {
                commentRef: doc(db, 'comments', `${mediaInfo.id}`, "all", commentCreatedDoc.id)
            })
        }

        getCommentsForCurrMedia()

        setIsLoading(false)
    }

    return (
        <React.Fragment>

            {/* SHOWS USER LOGIN MODAL */}
            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {(!user && isUserModalOpen) && (
                    <UserModal
                        onClick={() => setIsUserModalOpen(false)}
                        auth={auth}
                    />
                )}
            </AnimatePresence>

            <div id={styles.container}>

                <div id={styles.write_comment_container}>

                    <div className={styles.img_container}>
                        {user ? (
                            <Image
                                src={user.photoURL || ProfileFallbackImg}
                                alt={user.displayName!}
                                fill
                                sizes='60px'
                            />
                        ) : (
                            <span></span>
                        )}
                    </div>

                    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleCreateComment(e)}>
                        <label>
                            Leave your comment
                            <textarea
                                rows={3} cols={70}
                                name='comment'
                                onChange={() => wasCommentCreatedSuccessfully ? setWasCommentCreatedSuccessfully(false) : null}
                                placeholder='Your comment here'
                                required
                            ></textarea>
                        </label>

                        <label id={styles.checkbox_row}>
                            Is a Spoiler
                            <input type='checkbox' name='spoiler' value="true"></input>
                        </label>

                        <motion.button
                            type='submit'
                            disabled={isLoading || user?.isAnonymous}
                            whileTap={{ scale: 0.9 }}
                        >
                            {wasCommentCreatedSuccessfully ?
                                <><SvgCheck width={16} height={16} alt="Check" /> Comment Done</>
                                :
                                "Comment!"
                            }
                        </motion.button>
                    </form>

                </div>

                {/* ALL COMMENTS FROM DB FOR THIS MEDIA */}
                <div id={styles.all_comments_container}>

                    {commentsList.length > 0 && (
                        <React.Fragment>
                            <div id={styles.comments_heading}>
                                {commentsList.length > 1 && (
                                    <div id={styles.custom_select}>

                                        <SvgFilter width={16} height={16} alt="Filter" />

                                        <select
                                            onChange={(e) => handleCommentsSortBy(e.target.value as "date" | "likes" | "dislikes")}
                                            title="Choose How To Sort The Comments"
                                        >
                                            <option selected value="date">Most Recent</option>
                                            <option value="likes">Most Likes</option>
                                            <option value="dislikes">Most Dislikes</option>
                                        </select>

                                    </div>
                                )}

                                <p>{commentsList.length} comment{commentsList.length > 1 ? "s" : ""}</p>
                            </div>

                            <ul>
                                {!isLoading && (
                                    commentsList.slice(0, commentsSliceRange).map((comment, key) => (
                                        <Comment
                                            key={key}
                                            item={comment as Comment}
                                            mediaId={mediaInfo.id}
                                        />
                                    ))
                                )}
                            </ul>

                            {commentsList.length > commentsSliceRange && (

                                <button onClick={() => handleCommentsSliceRange()}>
                                    SEE MORE COMMENTS
                                </button>

                            )}
                        </React.Fragment>
                    )}

                    {isLoading && (
                        <div>

                            <SvgLoading width={120} height={120} alt="Loading" />

                        </div>
                    )}

                    {(commentsList.length == 0 && !isLoading) && (
                        <div id={styles.no_comments_container}>

                            <p>No Comments Yet</p>

                        </div>
                    )}

                </div>

            </div>
        </React.Fragment>
    )

}

export default CommentsSection