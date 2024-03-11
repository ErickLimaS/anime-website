import { motion } from 'framer-motion'
import React, { MouseEventHandler, useState } from 'react'
import styles from "./component.module.css"
import CheckSvg from '@/public/assets/check-circle-fill.svg'
import LoadingSvg from '@/public/assets/ripple-1s-200px.svg'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteDoc, deleteField, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'
import { Auth } from 'firebase/auth'

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

    const [currentLang, setCurrentLang] = useState<string | null>(null)

    const db = getFirestore(initFirebase());

    const btnVariants = {

        tap: {
            scale: 0.9
        }

    }

    // changes info of user. mainly used to change video language
    async function changeSettings(e: React.FormEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        if (!user) return

        setIsLoading(true)
        setWasSuccessfull(false)

        const form: any = e.target

        await updateDoc(doc(db, 'users', user.uid),
            {
                videoSubtitleLanguage: form.language.value
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

        return

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

                    <h5>Video</h5>

                    {currentLang && (
                        <label>
                            Subtitle Language
                            <select
                                name='language'
                                defaultValue={currentLang}
                            >
                                <option value="English">English</option>
                                <option value="Portuguese - Portuguese(Brazil)">Brazilian Portuguese</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Spanish - Spanish(Latin_America)">Spanish - Latin America</option>
                                <option value="German">German</option>
                                <option value="Italian">Italian</option>
                                <option value="Russian">Russian</option>
                                <option value="Francese">Francese</option>
                                <option value="Arabic">Arabic</option>
                            </select>
                        </label>
                    )}

                    <h5>Delete (can not be reverted!)</h5>

                    <div className={styles.btns_container}>
                        <label>
                            <motion.button
                                onClick={() => deleteAccountInfo("bookmarks")}
                                variants={btnVariants}
                                whileTap="tap"
                            >
                                Delete Watchlist
                            </motion.button>
                        </label>

                        <label>
                            <motion.button
                                onClick={() => deleteAccountInfo("episodes")}
                                variants={btnVariants}
                                whileTap="tap"
                            >
                                Delete Episodes Watched
                            </motion.button>
                        </label>

                        <label>
                            <motion.button
                                onClick={() => deleteAccountInfo("account")}
                                variants={btnVariants}
                                whileTap="tap"
                            >
                                Delete All Account Info
                            </motion.button>
                        </label>
                    </div>

                    <button
                        type='submit'
                        data-change-success={wasSuccessfull}
                        disabled={isLoading}
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