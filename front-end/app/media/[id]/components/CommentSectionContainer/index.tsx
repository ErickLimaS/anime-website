"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import Image from 'next/image';
import {
    getFirestore, doc, arrayUnion, FieldPath, setDoc,
    DocumentSnapshot, DocumentData, QueryDocumentSnapshot,
    addDoc, collection, getDocs, QuerySnapshot
} from 'firebase/firestore';
import { initFirebase } from "@/firebase/firebaseApp"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import Comment from '../CommentContainer';
import SvgCheck from "@/public/assets/check-circle-fill.svg"
import SvgLoading from "@/public/assets/ripple-1s-200px.svg"
import SvgFilter from "@/public/assets/filter-right.svg"

function CommentSectionContainer({ media }: { media: ApiMediaResults }) {

    const [comments, setComments] = useState<DocumentData[]>([])
    const [commentSaved, setCommentSaved] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [sortComments, setSortComments] = useState<string>("date")
    const [commentsSliceRange, setCommentsSliceRange] = useState<number>(3)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // SHOWS MORE COMMENTS ON CLICK
    function setNewSliceRange() {

        setCommentsSliceRange(commentsSliceRange + 5)

    }

    async function sortCommentsBy(sort: string, data?: DocumentData[]) {

        let sorted

        if (!data) await loadComments()

        setIsLoading(true)

        switch (sort) {
            case "date":

                sorted = (data || comments).sort((x, y) => y.createdAt - x.createdAt)
                setComments(sorted)

                break

            case "likes":

                sorted = (data || comments).sort((x, y) => y.likes - x.likes)
                setComments(sorted)

                break

            case "dislikes":

                sorted = (data || comments).sort((x, y) => y.dislikes - x.dislikes)
                setComments(sorted)

                break

            default:

                sorted = (data || comments).sort((x, y) => y.createdAt - x.createdAt)
                setComments(sorted)

                break

        }

        setIsLoading(false)

    }

    // GET ALL COMMENTS ON DB RELATED TO THIS MEDIA ID
    async function loadComments() {

        setIsLoading(true)

        let commentsToThisMedia: QuerySnapshot<DocumentData, DocumentData> = await getDocs(collection(db, 'comments', `${media.id}`, "all"))

        // IF HAS NO COMMENTS DOC ON FIRESTORE, IT CREATES ONE
        if (!commentsToThisMedia) {

            await setDoc(doc(db, 'comments', `${media.id}`), {}) as unknown as DocumentSnapshot<DocumentData, DocumentData>

            commentsToThisMedia = await getDocs(collection(db, 'comments', `${media.id}`, "all"))

            return
        }

        const data = commentsToThisMedia.docs.map((doc: QueryDocumentSnapshot) => doc.data())

        // SORT AND SET COMMENTS TO STATE
        await sortCommentsBy("date", data)

        setIsLoading(false)

    }

    // CREATES DOCUMENT ON THIS MEDIA COLLECTION, AND UPDATES USER DOC WITH INFO THE REF THIS COMMENT DOC
    async function createComment(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault()

        if (!user) return

        const form = e.target as any

        if (form.comment.value == "") return

        setIsLoading(true)

        const timeStamp = Math.floor(new Date().getTime() / 1000.0)

        // SAVES COMMENT ON DB
        const commentSaved = await addDoc(collection(db, 'comments', `${media.id}`, "all"),
            {
                userId: doc(db, "users", user.uid),
                username: user.displayName,
                userPhoto: user.photoURL,
                createdAt: timeStamp,
                // createdAt: serverTimestamp() as FieldValue,
                comment: form.comment.value,
                isSpoiler: form.spoiler.checked,
                likes: 0,
                dislikes: 0
            }
        )

        if (commentSaved) {

            form.comment.value = ""
            setCommentSaved(true)

            // UPDATES USER COMMENTS MADE
            await setDoc(doc(db, 'users', user.uid), {
                comments: {
                    written: arrayUnion(...[{
                        commentRef: commentSaved.id,
                        media: {
                            id: media.id,
                            coverImage: {
                                extraLarge: media.coverImage.extraLarge
                            },
                            title: {
                                romaji: media.title.romaji
                            }
                        }
                    }])
                }
            } as unknown as FieldPath, { merge: true }
            )

        }

        loadComments()

        setIsLoading(false)
    }

    useEffect(() => {

        loadComments()

    }, [media, user])


    return (
        <div id={styles.container}>

            <div id={styles.write_comment_container}>

                <div className={styles.img_container}>
                    {user ? (
                        <Image src={user.photoURL!} alt={user.displayName!} fill sizes='100%' />
                    ) : (
                        <></>
                    )}
                </div>

                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => createComment(e)}>
                    <label>
                        Leave your comment
                        <textarea rows={4} cols={70} name='comment' onChange={() => setCommentSaved(false)}></textarea>
                    </label>

                    <label id={styles.checkbox_row}>
                        Is Spoiler
                        <input type='checkbox' name='spoiler' value="true"></input>
                    </label>

                    <button type='submit' disabled={isLoading} >
                        {commentSaved ? <><SvgCheck width={16} height={16} alt="Check" /> Comment Done</> : "Comment"}
                    </button>
                </form>

            </div>

            <div id={styles.all_comments_container}>

                {comments.length > 0 && (
                    <>
                        {comments.length > 2 && (
                            <div id={styles.custom_select}>
                                <SvgFilter width={16} height={16} alt="Filter" />
                                <select onChange={(e) => sortCommentsBy(e.target.value)} title="Choose How To Sort The Comments">
                                    <option selected value="date">Most Recent</option>
                                    <option value="likes">Most Likes</option>
                                    <option value="dislikes">Most Dislikes</option>
                                </select>
                            </div>
                        )}

                        <ul>
                            {!isLoading ? (
                                comments.slice(0, commentsSliceRange).map((item, key) => (
                                    <Comment key={key} item={item as Comment} mediaId={media.id} />
                                ))
                            ) : (
                                <></>
                            )}
                        </ul>

                        {comments.length > commentsSliceRange && (

                            <button onClick={() => setNewSliceRange()}>SEE MORE COMMENTS</button>

                        )}
                    </>
                )}

                {isLoading && (
                    <div >

                        <SvgLoading width={120} height={120} alt="Loading" />

                    </div>
                )}

                {(comments.length == 0 && !isLoading) && (
                    <div id={styles.no_comments_container}>

                        <p>No Comments Yet.</p>

                    </div>
                )}

            </div>

        </div>
    )

}

export default CommentSectionContainer