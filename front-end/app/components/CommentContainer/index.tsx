"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import styles from "./component.module.css"
import { convertFromUnix } from '@/app/lib/format_date_unix';
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
import { initFirebase } from '@/firebase/firebaseApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

function Comment({ item, mediaId }: { item: Comment, mediaId: number }) {

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isDisliked, setIsDisliked] = useState<boolean>(false)
    const [wasDeleted, setWasDeleted] = useState<boolean>(false)

    const [isSpoiler, setIsSpoiler] = useState<boolean>(item.isSpoiler)

    const [commentData, setCommentData] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | any>()
    const [commentDocId, setCommentDocId] = useState<string | DocumentData>()

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

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
    async function likeOrDislikeIncrease(button: string, add: boolean) {

        if (!user) return

        const query = await queryCommentDoc()

        const commentDocData = query![1] as DocumentData
        const commentDocId = query![0] as string

        switch (button) {

            case "like":

                await updateDoc(doc(db, 'comments', `${mediaId}`, "all", commentDocId), {

                    likes: add ? commentDocData.likes + 1 : (commentDocData.likes == 0 ? 0 : commentDocData.likes - 1),
                    dislikes: isDisliked ? commentDocData.dislikes - 1 : commentDocData.dislikes

                })

                // UPDATES USER INTERACTION WITH COMMENT
                if (add) {
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

                setCommentData(queryLikesUpdate![1])

                setIsLiked(add ? true : false)
                if (isDisliked) setIsDisliked(add ? false : true)

                return

            case "dislike":

                await updateDoc(doc(db, 'comments', `${mediaId}`, "all", commentDocId), {

                    likes: isLiked ? commentDocData.likes - 1 : commentDocData.likes,
                    dislikes: add ? commentDocData.dislikes + 1 : (commentDocData.dislikes == 0 ? 0 : commentDocData.dislikes - 1)

                })

                // UPDATES USER INTERACTION WITH COMMENT
                if (add) {
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

                setCommentData(queryDislikesUpdate![1])

                setIsDisliked(add ? true : false)
                if (isLiked) setIsLiked(add ? false : true)

                return

            default:
                return

        }

    }

    // DELETE COMMENT IF USER IS THE AUTHOR
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

        setCommentData(commentDocData)

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
        !wasDeleted && (
            <li className={styles.comment_container} data-has-spoiler={isSpoiler}>

                <div className={styles.user_img_container}>

                    <Image src={item.userPhoto} alt={item.username} fill sizes='100%' />

                </div>

                <div className={styles.comment_data}>

                    <div className={styles.heading_container}>
                        <h5>
                            {item.username.length > 10 ? `${item.username.slice(0, 10)}...` : item.username}
                        </h5>

                        <p>{convertFromUnix(item.createdAt, { month: "short" })}</p>
                    </div>

                    <div className={styles.comment_text_container} onClick={() => item.isSpoiler && setIsSpoiler(!isSpoiler)}>

                        <p>{item.comment}</p>

                    </div>

                    {commentData && (
                        <div className={`${styles.flex} display_flex_row space_beetween align_items_center`}>

                            <div className={styles.buttons_container}>
                                <button onClick={() => likeOrDislikeIncrease("like", isLiked ? false : true)}>
                                    {isLiked ? (
                                        <><SvgThumbUpFill width={16} height={16} alt="Thumbs Up" /> {commentData.likes != 0 && commentData.likes}  &#x2022; Likes </>
                                    ) : (
                                        <><SvgThumbUp width={16} height={16} alt="Thumbs Up" /> {commentData.likes != 0 && commentData.likes} &#x2022; Like </>
                                    )}
                                </button>

                                <button onClick={() => likeOrDislikeIncrease("dislike", isDisliked ? false : true)}>
                                    {isDisliked ? (
                                        <> <SvgThumbDownFill width={16} height={16} alt="Thumbs Down" /> {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislikes </>
                                    ) : (
                                        <><SvgThumbDown width={16} height={16} alt="Thumbs Down" /> {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislike </>
                                    )}
                                </button>

                                {/* <button onClick={() => console.log("")} disabled>
                                    <SvgReply width={16} height={16} alt="Reply" />Reply
                                </button> */}

                                {(user?.uid == item.userId.id) && (
                                    <button className={styles.delete_btn} onClick={() => deleteComment()}><SvgTrash width={16} height={16} alt="Delete Icon" />Delete</button>
                                )}
                            </div>

                            {commentData.episodeNumber && (
                                <small>On Episode {commentData.episodeNumber}</small>
                            )}

                        </div>
                    )}
                </div>

            </li >
        )

    )
}

export default Comment