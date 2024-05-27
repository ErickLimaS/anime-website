"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import styles from "./component.module.css"
import { convertFromUnix } from '@/app/lib/formatDateUnix';
import SvgThumbUp from "@/public/assets/hand-thumbs-up.svg"
import SvgThumbUpFill from "@/public/assets/hand-thumbs-up-fill.svg"
import SvgThumbDown from "@/public/assets/hand-thumbs-down.svg"
import SvgThumbDownFill from "@/public/assets/hand-thumbs-down-fill.svg"
import SvgTrash from "@/public/assets/trash.svg"
import SvgReply from "@/public/assets/reply.svg"
import {
    DocumentData, DocumentSnapshot, FieldPath, QueryDocumentSnapshot,
    arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs,
    getFirestore, query, setDoc, updateDoc, where
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';
import UserModal from '@/app/components/UserLoginModal';

export default function Comment({ item, mediaId }: { item: Comment, mediaId: number }) {

    const [isLiked, setWasLiked] = useState<boolean>(false)
    const [wasDisliked, setWasDisliked] = useState<boolean>(false)
    const [wasDeleted, setWasDeleted] = useState<boolean>(false)

    const [isSpoiler, setIsSpoiler] = useState<boolean>(item.isSpoiler)

    const [commentData, setCommentData] = useState<Comment>()
    const [commentDocId, setCommentDocId] = useState<string | DocumentData>()

    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    useEffect(() => { getCommentCurrLikesAndDislikes() }, [user, item, mediaId])

    async function getCommentDoc() {

        const queryComment = query(collection(db, 'comments', `${mediaId}`, "all"), where("createdAt", "==", item.createdAt))

        const commentDoc = await getDocs(queryComment)

        if (!commentDoc.docs[0]) return

        const commentDocId = commentDoc.docs[0].id
        const commentDocData = commentDoc.docs[0].data()

        return {
            commentDocId: commentDocId,
            commentDocData: commentDocData as Comment | DocumentData
        }

    }

    async function handleLikesAndDislikesActions(buttonActionType: "like" | "dislike", isActionSetToTrue: boolean) {

        if (!user) return setIsUserModalOpen(true)

        if (user.isAnonymous) return

        const queryComment = await getCommentDoc()

        const commentDocData = queryComment!.commentDocData
        const commentDocId = queryComment!.commentDocId

        switch (buttonActionType) {

            case "like":

                await updateDoc(doc(db, 'comments', `${mediaId}`, "all", commentDocId), {

                    likes: isActionSetToTrue ? commentDocData.likes + 1 : (commentDocData.likes == 0 ? 0 : commentDocData.likes - 1),
                    dislikes: wasDisliked ? commentDocData.dislikes - 1 : commentDocData.dislikes

                })

                const commentLikedData = {
                    commentRef: commentDocId,
                    wasLiked: true,
                    wasDisliked: false,
                    wasReply: false
                }

                await setDoc(doc(db, 'users', user.uid), {
                    comments: {
                        interacted: isActionSetToTrue ? arrayUnion(...[commentLikedData]) : arrayRemove(...[commentLikedData])
                    }
                } as unknown as FieldPath,
                    { merge: true }
                )

                const queryUpdatedComment = await getCommentDoc()

                setCommentData(queryUpdatedComment!.commentDocData as Comment)

                setWasLiked(isActionSetToTrue)
                if (wasDisliked) setWasDisliked(isActionSetToTrue ? false : true)

                return

            case "dislike":

                await updateDoc(doc(db, 'comments', `${mediaId}`, "all", commentDocId), {

                    likes: isLiked ? commentDocData.likes - 1 : commentDocData.likes,
                    dislikes: isActionSetToTrue ? commentDocData.dislikes + 1 : (commentDocData.dislikes == 0 ? 0 : commentDocData.dislikes - 1)

                })

                const commentDislikedData = {
                    commentRef: commentDocId,
                    wasLiked: false,
                    wasDisliked: true,
                    wasReply: false
                }

                await setDoc(doc(db, 'users', user.uid), {
                    comments: {
                        interacted: isActionSetToTrue ? arrayUnion(...[commentDislikedData]) : arrayRemove(...[commentDislikedData])
                    }
                } as unknown as FieldPath,
                    { merge: true }
                )

                const queryDislikesUpdate = await getCommentDoc()

                setCommentData(queryDislikesUpdate?.commentDocData as Comment)

                setWasDisliked(isActionSetToTrue)
                if (isLiked) setWasLiked(isActionSetToTrue ? false : true)

                return

            default:
                return

        }

    }

    async function deleteCurrComment() {

        // Only deletes from Curr Media Collection
        // Doesnt delete from User Doc comment history (so we can keep control)

        await deleteDoc(doc(db, 'comments', `${mediaId}`, "all", `${commentDocId}`)).then(() => {

            setWasDeleted(true)

        })

    }

    async function getCommentCurrLikesAndDislikes() {

        const docQuery = await getCommentDoc()

        setCommentDocId(docQuery?.commentDocId)

        setCommentData(docQuery?.commentDocData as Comment)

        if (!user) return // bellow is just to check curr user interactions with this comment

        const userDoc = await getDoc(doc(db, 'users', user.uid))

        const userInteractionWithCurrComment = userDoc.get("comments.interacted")?.find(
            (item: { commentRef: string }) => item.commentRef == docQuery?.commentDocId
        )

        if (!userInteractionWithCurrComment) return

        if (userInteractionWithCurrComment.wasLiked) setWasLiked(true)
        if (userInteractionWithCurrComment.wasDisliked) setWasDisliked(true)

    }

    return (
        <React.Fragment>

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

            {!wasDeleted && (
                <li className={styles.comment_container} data-has-spoiler={isSpoiler}>

                    <div className={styles.user_img_container}>

                        <Image
                            src={item.userPhoto}
                            alt={item.username}
                            fill
                            sizes='72px'
                        />

                    </div>

                    <div className={styles.comment_data}>

                        <div className={styles.heading_container}>
                            <h5>
                                {item.username.length > 25 ? `${item.username.slice(0, 25)}...` : item.username}
                            </h5>

                            <p>
                                {convertFromUnix(item.createdAt, { month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>

                        <div className={styles.comment_text_container} onClick={() => item.isSpoiler && setIsSpoiler(!isSpoiler)}>

                            <p>{item.comment}</p>

                        </div>

                        {commentData && (
                            <div className={`${styles.flex} display_flex_row space_beetween align_items_center`}>

                                <div className={styles.buttons_container}>
                                    <button onClick={() => handleLikesAndDislikesActions("like", isLiked ? false : true)}>

                                        <SvgIcons type={"like"} isBtnActive={isLiked} commentData={commentData} />

                                    </button>

                                    <button onClick={() => handleLikesAndDislikesActions("dislike", wasDisliked ? false : true)}>

                                        <SvgIcons type={"like"} isBtnActive={wasDisliked} commentData={commentData} />

                                    </button>

                                    {/* 
                                    <button onClick={() => console.log("")} disabled>
                                        <SvgIcons type={"reply"} isBtnActive={"#"} commentData={#} />
                                        <SvgReply width={16} height={16} alt="Reply" />Reply
                                    </button>
                                    */}

                                    {(user?.uid == item.userId.id) && (
                                        <button className={styles.delete_btn} onClick={() => deleteCurrComment()}>
                                            <SvgTrash width={16} height={16} alt="Delete Icon" />Delete
                                        </button>
                                    )}
                                </div>

                                {commentData.episodeNumber && (
                                    <small>On Episode {commentData.episodeNumber}</small>
                                )}

                            </div>
                        )}
                    </div>

                </li >
            )}
        </React.Fragment>

    )
}

function SvgIcons({ type, isBtnActive, commentData }: { type: "like" | "dislike", isBtnActive: boolean, commentData: { likes: number, dislikes: number } }) {

    switch (type) {

        case 'like':

            if (isBtnActive) {
                return <><SvgThumbUpFill width={16} height={16} alt="Thumbs Up" /> {commentData.likes != 0 && commentData.likes}  & #x2022; Likes</>
            }

            return <><SvgThumbUp width={16} height={16} alt="Thumbs Up" /> {commentData.likes != 0 && commentData.likes} & #x2022; Like</>

        case 'dislike':

            if (isBtnActive) {
                return <> <SvgThumbDownFill width={16} height={16} alt="Thumbs Down" /> {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislikes</>
            }

            return <><SvgThumbDown width={16} height={16} alt="Thumbs Down" /> {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislike</>

        default:
            return

    }

}