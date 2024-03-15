import { AnimatePresence, motion } from 'framer-motion'
import React, { MouseEventHandler, useState } from 'react'
import styles from "./component.module.css"
import CheckSvg from '@/public/assets/check-circle-fill.svg'
import LoadingSvg from '@/public/assets/ripple-1s-200px.svg'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteDoc, deleteField, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'
import { Auth, deleteUser } from 'firebase/auth'

function UserSettingsModal({ onClick, auth, }: { onClick?: MouseEventHandler<HTMLDivElement>, auth: Auth }) {

    const dropIn = {

        hidden: {
            x: "-100vw",
            opacity: 0
        },
        visible: {
            x: "0",
            opacity: 1,
            transition: {
                duration: 0.2,
                damping: 25,
                type: "spring",
                stiffness: 500
            }
        },
        exit: {
            x: "100vw",
            opacity: 0
        }

    }

    const [user] = useAuthState(auth)

    const [isLoading, setIsLoading] = useState(false)
    const [wasSuccessfull, setWasSuccessfull] = useState<boolean | null>(null)

    const [deleteBookmarksClick, setDeleteBookmarksClick] = useState<boolean>(false)
    const [deleteEpisodesClick, setDeleteEpisodessClick] = useState<boolean>(false)
    const [deleteAccountClick, setDeleteAccountClick] = useState<boolean>(false)

    const [currentLang, setCurrentLang] = useState<string | null>(null)
    const [currentSource, setCurrentSource] = useState<string | null>(null)
    const [currentQuality, setCurrentQuality] = useState<string | null>(null)

    const db = getFirestore(initFirebase());

    const btnVariants = {

        tap: {
            scale: 0.9
        }

    }

    const languagesOptions = [

        { name: "English", value: "English" },
        { name: "Portuguese", value: "Portuguese" },
        { name: "Spanish", value: "Spanish" },
        { name: "German", value: "German" },
        { name: "Italian", value: "Italian" },
        { name: "Russian", value: "Russian" },
        { name: "French", value: "French" },
        { name: "Arabic", value: "Arabic" },

    ]

    const sourcesOptions = [

        { name: "Crunchyroll", value: "crunchyroll" },
        { name: "GoGoAnime", value: "gogoanime" },
        { name: "Aniwatch", value: "aniwatch" },

    ]

    const qualityOptions = [

        { name: "Auto", value: "auto" },
        { name: "1080p", value: "1080p" },
        { name: "720p", value: "720p" },
        { name: "480p", value: "480p" },
        { name: "360p", value: "360p" },
        { name: "144p", value: "144p" },

    ]

    // changes info of user. mainly used to change video language
    async function changeSettings(e: React.FormEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        if (!user) return

        setIsLoading(true)
        setWasSuccessfull(false)

        const form: any = e.target

        await updateDoc(doc(db, 'users', user.uid),
            {
                videoSubtitleLanguage: form.language.value,
                videoSource: form.source.value,
                videoQuality: form.quality.value
            }
        )

        setIsLoading(false)
        setWasSuccessfull(true)

    }

    // delete field or account of user
    async function deleteAccountInfo(option: string) {

        if (!user) return

        setIsLoading(true)
        setWasSuccessfull(false)

        switch (option) {

            case "bookmarks":

                await updateDoc(doc(db, 'users', user.uid),
                    {
                        bookmarks: deleteField()
                    }
                )

                setIsLoading(false)
                setWasSuccessfull(true)

                break

            case "episodes":

                await updateDoc(doc(db, 'users', user.uid),
                    {
                        episodesWatchedBySource: deleteField()
                    }
                )

                setIsLoading(false)
                setWasSuccessfull(true)

                break

            case "account":

                await deleteDoc(doc(db, 'users', user.uid))
                await deleteUser(user)

                auth.signOut()

                window.location.reload()

                break

            default:
                return

        }

    }

    // auto run to get current language saved
    (async function checkCurrentInfo() {

        if (!user) return

        const data = await getDoc(doc(db, 'users', user.uid))

        setCurrentLang(await data.get("videoSubtitleLanguage") as string || "English")
        setCurrentSource(await data.get("videoSource") as string || "crunchyroll")
        setCurrentQuality(await data.get("videoQuality") as string || "auto")

    }())

    return (
        <motion.div
            id={styles.backdrop}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                id={styles.modal}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >

                <form onSubmit={(e) => changeSettings(e)}>

                    <div className={styles.group_container}>

                        <h5>Video</h5>

                        <div>
                            {currentLang && (
                                <label>
                                    Subtitle Language
                                    <select
                                        name='language'
                                        defaultValue={currentLang}
                                    >
                                        {languagesOptions.map((item, key) => (
                                            <option key={key} value={item.value}>{item.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <small>Only works with <b>Aniwatch</b></small>

                        </div>

                        <div>
                            {currentQuality && (
                                <label>
                                    Preferable Video Quality
                                    <select
                                        name='quality'
                                        defaultValue={currentQuality}
                                    >
                                        {qualityOptions.map((item, key) => (
                                            <option key={key} value={item.value}>{item.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <small>
                                Only works with <b>GoGoAnime</b>.
                                <br />
                                Some videos <b>may not have the quality selected</b>.
                                By that, the video will be displayed with the default quality.
                            </small>
                        </div>

                    </div>

                    <div className={styles.group_container}>
                        <h5>Source</h5>

                        <div>
                            {currentSource && (
                                <label>
                                    Select Source of Episodes
                                    <select
                                        name='source'
                                        defaultValue={currentSource}
                                    >
                                        {sourcesOptions.map((item, key) => (
                                            <option key={key} value={item.value}>{item.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}

                        </div>
                    </div>

                    <div >
                        <h5 style={{ marginBottom: "16px" }}>Delete <span>(can not be reverted!)</span></h5>

                        <div className={styles.btns_container}>
                            <label>
                                <motion.button
                                    type='button'
                                    onClick={() => setDeleteBookmarksClick(!deleteBookmarksClick)}
                                    variants={btnVariants}
                                    whileTap="tap"
                                    data-active={deleteBookmarksClick}
                                >
                                    Delete Watchlist
                                </motion.button>

                            </label>
                            <AnimatePresence
                                initial={false}
                                mode='wait'
                            >
                                {deleteBookmarksClick && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: "8px", marginBottom: "40px" }}
                                        animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                        exit={{ opacity: 0, height: 0, marginTop: "0", marginBottom: "0" }}
                                        className={styles.confirm_delete_container}
                                    >
                                        <p>Are you Sure?</p>
                                        <button type='button' onClick={() => setDeleteBookmarksClick(false)}>Cancel</button>
                                        <button onClick={() => deleteAccountInfo("bookmarks")}>Delete!</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <label>
                                <motion.button
                                    type='button'
                                    onClick={() => setDeleteEpisodessClick(!deleteEpisodesClick)}
                                    variants={btnVariants}
                                    whileTap="tap"
                                    data-active={deleteEpisodesClick}
                                >
                                    Delete Episodes Watched
                                </motion.button>
                            </label>
                            <AnimatePresence
                                initial={false}
                                mode='wait'
                            >
                                {deleteEpisodesClick && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: "8px", marginBottom: "40px" }}
                                        animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                        exit={{ opacity: 0, height: 0, marginTop: "0", marginBottom: "0" }}
                                        className={styles.confirm_delete_container}
                                    >
                                        <p>Are you Sure?</p>
                                        <button type='button' onClick={() => setDeleteEpisodessClick(false)}>Cancel</button>
                                        <button onClick={() => deleteAccountInfo("episodes")}>Delete!</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <label>
                                <motion.button
                                    type='button'
                                    onClick={() => setDeleteAccountClick(!deleteAccountClick)}
                                    variants={btnVariants}
                                    whileTap="tap"
                                    data-active={deleteAccountClick}
                                >
                                    Delete All Account Info
                                </motion.button>
                            </label>
                            <AnimatePresence
                                initial={false}
                                mode='wait'
                            >
                                {deleteAccountClick && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: "8px", marginBottom: "40px" }}
                                        animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                        exit={{ opacity: 0, height: 0, marginTop: "0", marginBottom: "0" }}
                                        className={styles.confirm_delete_container}
                                    >
                                        <p>Are you Sure?</p>
                                        <button type='button' onClick={() => setDeleteAccountClick(false)}>Cancel</button>
                                        <button onClick={() => deleteAccountInfo("account")}>Delete!</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>

                    <button
                        type='submit'
                        data-change-success={wasSuccessfull}
                        disabled={isLoading}
                        title='Submit Changes'
                    >
                        {isLoading ?
                            <LoadingSvg width={21} height={21} />
                            :
                            wasSuccessfull == true ?
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0 8px" }}>
                                    <CheckSvg width={16} height={16} /> Changes Complete
                                </span>
                                :
                                "Confirm Changes"
                        }
                    </button>

                </form>

            </motion.div>
        </motion.div >
    )

}

export default UserSettingsModal