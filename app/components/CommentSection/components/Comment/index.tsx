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

function Comment({ item, mediaId }: { item: Comment, mediaId: number }) {

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isDisliked, setIsDisliked] = useState<boolean>(false)
    const [wasDeleted, setWasDeleted] = useState<boolean>(false)

    const [isSpoiler, setIsSpoiler] = useState<boolean>(item.isSpoiler)

    const [commentData, setCommentData] = useState<Comment>()
    const [commentDocId, setCommentDocId] = useState<string | DocumentData>()

    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // GET COMMENT DOC ID AND DATA
    async function queryCommentDoc() {

        const queryItem = query(collection(db, 'comments', `${mediaId}`, "all"), where("createdAt", "==", item.createdAt))

        const querySnapshot = await getDocs(queryItem)

        if (!querySnapshot.docs[0]) return

        const commentDocId = querySnapshot.docs[0].id
        const commentDocData = querySnapshot.docs[0].data()

        return [commentDocId, commentDocData]

    }

    // INCREASES NUMBER OF INTERACTIONS WITH BUTTONS LIKE DISLIKE
    async function likeOrDislikeIncrease(buttonAction: string, addAction: boolean) {

        if (!user) return setIsUserModalOpen(true)

        if (user.isAnonymous) return

        const query = await queryCommentDoc()

        const commentDocData = query![1] as DocumentData
        const commentDocId = query![0] as string

        switch (buttonAction) {

            case "like":

                await updateDoc(doc(db, 'comments', `${mediaId}`, "all", commentDocId), {

                    likes: addAction ? commentDocData.likes + 1 : (commentDocData.likes == 0 ? 0 : commentDocData.likes - 1),
                    dislikes: isDisliked ? commentDocData.dislikes - 1 : commentDocData.dislikes

                })

                // UPDATES USER INTERACTION WITH COMMENT
                if (addAction) {
                    await setDoc(doc(db, 'users', user.uid), {
                        comments: {
                            interacted: arrayUnion(...[{
                                commentRef: commentDocId,
                                wasLiked: true,
                                wasDisliked: false,
                                wasReply: false
                            }])
                        }
                    } as unknown as FieldPath,
                        { merge: true }
                    )
                }
                else {
                    await setDoc(doc(db, 'users', user.uid), {
                        comments: {
                            interacted: arrayRemove(...[{
                                commentRef: commentDocId,
                                wasLiked: true,
                                wasDisliked: false,
                                wasReply: false
                            }])
                        }
                    } as unknown as FieldPath,
                        { merge: true }
                    )
                }

                const queryLikesUpdate = await queryCommentDoc()

                setCommentData(queryLikesUpdate![1] as Comment)

                setIsLiked(addAction ? true : false)
                if (isDisliked) setIsDisliked(addAction ? false : true)

                return

            case "dislike":

                await updateDoc(doc(db, 'comments', `${mediaId}`, "all", commentDocId), {

                    likes: isLiked ? commentDocData.likes - 1 : commentDocData.likes,
                    dislikes: addAction ? commentDocData.dislikes + 1 : (commentDocData.dislikes == 0 ? 0 : commentDocData.dislikes - 1)

                })

                // UPDATES USER INTERACTION WITH COMMENT
                if (addAction) {
                    await setDoc(doc(db, 'users', user.uid), {
                        comments: {
                            interacted: arrayUnion(...[{
                                commentRef: commentDocId,
                                wasLiked: false,
                                wasDisliked: true,
                                wasReply: false
                            }])
                        }
                    } as unknown as FieldPath,
                        { merge: true }
                    )
                }
                else {
                    await setDoc(doc(db, 'users', user.uid), {
                        comments: {
                            interacted: arrayRemove(...[{
                                commentRef: commentDocId,
                                wasLiked: false,
                                wasDisliked: true,
                                wasReply: false
                            }])
                        }
                    } as unknown as FieldPath,
                        { merge: true }
                    )
                }

                const queryDislikesUpdate = await queryCommentDoc()

                setCommentData(queryDislikesUpdate![1] as Comment)

                setIsDisliked(addAction ? true : false)
                if (isLiked) setIsLiked(addAction ? false : true)

                return

            default:
                return

        }

    }

    // IF USER IS THE AUTHOR, DELETE COMMENT
    async function deleteComment() {

        await deleteDoc(doc(db, 'comments', `${mediaId}`, "all", `${commentDocId}`))

        setWasDeleted(true)

    }

    // CHECKS HOW MANY INTERACTIONS THE COMMENT HAS
    async function checkLikesAndDislikes() {

        const docQuery = await queryCommentDoc()

        const commentDocId = docQuery![0]
        const commentDocData = docQuery![1]

        setCommentDocId(commentDocId)

        setCommentData(commentDocData as Comment)

        if (!user) return

        // CHECKS IF USER HAS LIKED OR DISLIKED
        let queryUserDoc: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(doc(db, 'users', user.uid))

        // IF USER HAS NO DOC ON FIRESTORE, IT CREATES ONE
        if (queryUserDoc.exists() == false) {

            queryUserDoc = await setDoc(doc(db, 'users', user.uid), {}) as unknown as DocumentSnapshot<DocumentData, DocumentData>

            return
        }

        const docCommentIntereactionOnUser = queryUserDoc.get("comments.interacted")?.find((item: { commentRef: string }) => item.commentRef == commentDocId)

        if (docCommentIntereactionOnUser) {
            if (docCommentIntereactionOnUser.wasLiked) setIsLiked(true)
            if (docCommentIntereactionOnUser.wasDisliked) setIsDisliked(true)
        }

    }

    useEffect(() => {

        checkLikesAndDislikes()

    }, [user, item, mediaId])

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
                                    <button onClick={() => likeOrDislikeIncrease("like", isLiked ? false : true)}>
                                        {isLiked ? (
                                            <>
                                                <SvgThumbUpFill width={16} height={16} alt="Thumbs Up" /> {commentData.likes != 0 && commentData.likes}  &#x2022; Likes
                                            </>
                                        ) : (
                                            <>
                                                <SvgThumbUp width={16} height={16} alt="Thumbs Up" /> {commentData.likes != 0 && commentData.likes} &#x2022; Like
                                            </>
                                        )}
                                    </button>

                                    <button onClick={() => likeOrDislikeIncrease("dislike", isDisliked ? false : true)}>
                                        {isDisliked ? (
                                            <>
                                                <SvgThumbDownFill width={16} height={16} alt="Thumbs Down" /> {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislikes
                                            </>
                                        ) : (
                                            <>
                                                <SvgThumbDown width={16} height={16} alt="Thumbs Down" /> {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislike
                                            </>
                                        )}
                                    </button>

                                    {/* 
                                    <button onClick={() => console.log("")} disabled>
                                        <SvgReply width={16} height={16} alt="Reply" />Reply
                                    </button>
                                    */}

                                    {(user?.uid == item.userId.id) && (
                                        <button className={styles.delete_btn} onClick={() => deleteComment()}>
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

export default Comment