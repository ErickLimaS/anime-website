import { AnimatePresence, motion } from 'framer-motion'
import React, { MouseEventHandler, useState } from 'react'
import styles from "./component.module.css"
import CheckSvg from '@/public/assets/check-circle-fill.svg'
import LoadingSvg from '@/public/assets/ripple-1s-200px.svg'
import CloseSvg from '@/public/assets/x.svg'
import UserSvg from '@/public/assets/person-circle.svg'
import VideoSvg from '@/public/assets/play.svg'
import SourceSvg from '@/public/assets/globe2.svg'
import DeleteSvg from '@/public/assets/trash.svg'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteDoc, deleteField, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { Auth, deleteUser, updateProfile } from 'firebase/auth'
import Image from 'next/image'
import { initFirebase } from '@/app/firebaseApp'
import * as contantOptions from "./contantOptions"

type SettingsTypes = {
    onClick?: MouseEventHandler<HTMLDivElement> | MouseEventHandler<HTMLButtonElement> | ((value: void) => void | PromiseLike<void>) | null | undefined,
    auth: Auth,
    newUser?: boolean
}

const framerMotionDropIn = {

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

const framerMotionBtnVariants = {

    tap: {
        scale: 0.9
    }

}

function UserSettingsModal({ onClick, auth, newUser }: SettingsTypes) {

    const [user] = useAuthState(auth)

    const [isLoading, setIsLoading] = useState(false)
    const [wasSuccessfull, setWasSuccessfull] = useState<boolean | null>(null)

    const [openUserProfilePanel, setOpenUserProfilePanel] = useState<boolean>(false)
    const [newImgProfileSelected, setNewImgProfileSelected] = useState<string | null>(null)

    const [deleteBookmarksClick, setDeleteBookmarksClick] = useState<boolean>(false)
    const [deleteEpisodesClick, setDeleteEpisodesClick] = useState<boolean>(false)
    const [deleteNotificationsClick, setDeleteNotificationsClick] = useState<boolean>(false)
    const [deleteAccountClick, setDeleteAccountClick] = useState<boolean>(false)

    const [currentLang, setCurrentLang] = useState<string | null>(null)
    const [currentSource, setCurrentSource] = useState<string | null>(null)
    const [currentQuality, setCurrentQuality] = useState<string | null>(null)
    const [currentShowAdultContent, setCurrentShowAdultContent] = useState<boolean | null>(null)
    const [currentSkipIntroAndOutro, setCurrentSkipIntroAndOutro] = useState<boolean | null>(null)
    const [currentNextEpisode, setCurrentNextEpisode] = useState<boolean | null>(null)

    const db = getFirestore(initFirebase())

    async function handleUpdateUserInfoForm(e: React.FormEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        if (!user) return

        setIsLoading(true)
        setWasSuccessfull(false)

        const form: any = e.target

        // update user info
        if (newImgProfileSelected || form.username.value) {

            await updateProfile(user, {
                photoURL: newImgProfileSelected || user.photoURL,
                displayName: user.isAnonymous ? user.displayName : form.username.value || user.displayName
            })

        }

        await updateDoc(doc(db, 'users', user.uid),
            {
                videoSubtitleLanguage: form.language.value,
                videoSource: form.source.value,
                videoQuality: form.quality.value,
                showAdultContent: form.showAdultContent.checked,
                autoNextEpisode: form.autoNextEpisode.checked,
                autoSkipIntroAndOutro: form.skipIntroAndOutro.checked
            }
        ).then(onClick as ((value: void) => void | PromiseLike<void>) | null | undefined)

        setIsLoading(false)
        setWasSuccessfull(true)

    }

    // delete field or account of user
    async function deleteOptions(option: "account" | "bookmarks" | "notifications" | "episodes") {

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

            case "notifications":

                await updateDoc(doc(db, 'users', user.uid),
                    {
                        notifications: deleteField()
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
    (async function getUserSettings() {

        if (!user) return

        const data = await getDoc(doc(db, 'users', user.uid))

        setCurrentLang(await data.get("videoSubtitleLanguage") as string || "English")
        setCurrentSource(await data.get("videoSource") as string || "crunchyroll")
        setCurrentQuality(await data.get("videoQuality") as string || "auto")
        setCurrentShowAdultContent(await data.get("showAdultContent") || false)
        setCurrentSkipIntroAndOutro(await data.get("autoSkipIntroAndOutro") || false)
        setCurrentNextEpisode(await data.get("autoNextEpisode") || false)

    }())

    return (
        <motion.div
            id={styles.backdrop}
            onClick={!newUser ? (onClick as MouseEventHandler<HTMLDivElement>) : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                id={styles.modal}
                variants={framerMotionDropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className={styles.settings_heading}>
                    <h2>Configure Your Account</h2>

                    {!newUser && (
                        <motion.button
                            title="Close Settings"
                            onClick={onClick as MouseEventHandler<HTMLButtonElement>}
                            id={styles.close_menu_btn}
                            variants={framerMotionBtnVariants}
                            whileTap={"tap"}
                        >
                            <CloseSvg alt="Close" width={16} height={16} />
                        </motion.button>
                    )}
                </div>

                {user!.isAnonymous && (
                    <div id={styles.anonymous_disclaimer_container}>
                        <h5>You are in Anonymous Mode!</h5>
                        <p>In this mode you <b>can not</b> make Comments or change your Username.</p>
                    </div>
                )}

                <form onSubmit={(e) => handleUpdateUserInfoForm(e)}>

                    <div className={styles.group_container}>
                        <h5><span><UserSvg alt="Person" width={16} height={16} /></span> User</h5>

                        <div className={`${styles.user_acc_info_container}`}>
                            <div>
                                {user && (
                                    <>
                                        <label
                                            id={styles.img_container}
                                            onClick={() => setOpenUserProfilePanel(!openUserProfilePanel)}
                                        >
                                            Change Profile Image
                                            <Image
                                                src={user.photoURL as string}
                                                alt={user.displayName as string}
                                                fill
                                                sizes='(max-width: 400px) 95vw, (max-width: 520px) 109px, 140px'
                                            />
                                        </label>
                                    </>
                                )}
                            </div>

                            <div>
                                {user && (
                                    <React.Fragment>
                                        <label>
                                            Change Username
                                            <input
                                                type='text'
                                                name='username'
                                                disabled={user.isAnonymous}
                                                defaultValue={user.displayName as string}
                                                placeholder={user.displayName as string}
                                            ></input>
                                        </label>
                                        {user.isAnonymous && (
                                            <small>Can not change while <b>Anonymous</b></small>
                                        )}
                                    </React.Fragment>
                                )}
                                <AnimatePresence
                                    initial={false}
                                    mode='wait'
                                >
                                    {newImgProfileSelected && (
                                        <motion.small
                                            initial={{ opacity: 0, height: 0, marginTop: "8px" }}
                                            animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                            exit={{ opacity: 0, height: 0, marginTop: "0" }}
                                            style={{ height: "100%", display: "block", marginTop: "24px", color: "#2e882b", fontWeight: "500" }}
                                        >
                                            New Image Selected!
                                        </motion.small>
                                    )}

                                </AnimatePresence>
                            </div>

                        </div>

                        {/* IMAGES PANEL */}
                        <AnimatePresence
                            initial={false}
                            mode='wait'
                        >
                            {openUserProfilePanel && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: "8px", marginBottom: "40px" }}
                                    animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                    exit={{ opacity: 0, height: 0, marginTop: "0", marginBottom: "0" }}
                                    id={styles.imgs_panel_container}
                                >

                                    {contantOptions.imagesOptions.map((item, key) => (

                                        <motion.div
                                            key={key}
                                            className={styles.img_checkbox}
                                            variants={framerMotionBtnVariants}
                                            whileTap={"tap"}
                                        >
                                            <input
                                                type='checkbox'
                                                name='photoURL'
                                                value={item.value}
                                                checked={newImgProfileSelected ? newImgProfileSelected == item.value : false}
                                                onClick={(e: any) => setNewImgProfileSelected(newImgProfileSelected == e.target.value ? null : e.target.value)}
                                            >
                                            </input>
                                            <Image
                                                src={item.value}
                                                alt={item.name}
                                                fill
                                                sizes='(max-width: 479px) 30vw, 101px'
                                            />
                                        </motion.div>

                                    ))}

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={styles.group_container}>

                        <h5><span><VideoSvg alt="Play" width={16} height={16} /></span> Video</h5>

                        <div>
                            {currentLang && (
                                <label>
                                    Subtitle Language
                                    <select
                                        name='language'
                                        defaultValue={currentLang}
                                    >
                                        {contantOptions.languagesOptions.map((item, key) => (
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
                                    <span>
                                        Preferable Video Quality <span style={{ padding: "4px", background: "var(--brand-color)", color: "var(--white-100)" }}>BETA</span>
                                    </span>
                                    <select
                                        name='quality'
                                        defaultValue={currentQuality}
                                    >
                                        {contantOptions.qualityOptions.map((item, key) => (
                                            <option key={key} value={item.value}>{item.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <small>
                                Some videos <b>may not have the quality selected</b>.
                                By that, the video will be displayed with the default quality.
                            </small>
                        </div>

                        <div>
                            {(currentSkipIntroAndOutro != null) && (
                                <>
                                    <div className={styles.checkbox_container}>

                                        <label>
                                            <input
                                                type='checkbox'
                                                name='skipIntroAndOutro'
                                                defaultChecked={(currentSkipIntroAndOutro == true) as boolean}
                                            ></input>
                                            <span />

                                        </label>
                                        <p>Skip Openings And Endings</p>
                                    </div>

                                    <small style={{ marginTop: "16px", display: "block" }}>Only works with <b>Aniwatch</b></small>
                                </>
                            )}
                        </div>

                        <div>
                            {(currentNextEpisode != null) && (
                                <>
                                    <div className={styles.checkbox_container}>

                                        <label>
                                            <input
                                                type='checkbox'
                                                name='autoNextEpisode'
                                                defaultChecked={(currentNextEpisode == true) as boolean}
                                            ></input>
                                            <span />

                                        </label>
                                        <p>Auto Play Next Episode</p>

                                    </div>
                                </>
                            )}
                        </div>

                    </div>

                    <div className={styles.group_container}>
                        <h5><span><SourceSvg alt="Globe" width={16} height={16} /></span> Source</h5>

                        <div>
                            {currentSource && (
                                <>
                                    <label>
                                        Select Main Source of Episodes
                                        <select
                                            name='source'
                                            defaultValue={currentSource}
                                        >
                                            {contantOptions.sourcesOptions.map((item, key) => (
                                                <option key={key} value={item.value}>{item.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <small>Focus the anime episodes to the source selected. <b>You can still use the others sources.</b></small>
                                </>
                            )}
                        </div>

                        <div>
                            {(currentSource != null) && (
                                <>
                                    <div className={styles.checkbox_container}>

                                        <label>
                                            <input
                                                type='checkbox'
                                                name='showAdultContent'
                                                defaultChecked={(currentShowAdultContent == true) as boolean}
                                            ></input>
                                            <span />

                                        </label>
                                        <p>Show Adult Content (+18)</p>

                                    </div>
                                </>
                            )}
                        </div>

                    </div>

                    {!newUser && (
                        <div >
                            <h5 style={{ marginBottom: "16px" }}>
                                <span><DeleteSvg alt="Play" width={16} height={16} /></span> Delete <span style={{ color: "var(--white-75)" }}>(can not be reverted!)</span>
                            </h5>

                            <div className={styles.btns_container}>
                                <label>
                                    <motion.button
                                        type='button'
                                        onClick={() => setDeleteBookmarksClick(!deleteBookmarksClick)}
                                        variants={framerMotionBtnVariants}
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
                                            <button onClick={() => deleteOptions("bookmarks")}>Delete!</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <label>
                                    <motion.button
                                        type='button'
                                        onClick={() => setDeleteEpisodesClick(!deleteEpisodesClick)}
                                        variants={framerMotionBtnVariants}
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
                                            <button type='button' onClick={() => setDeleteEpisodesClick(false)}>Cancel</button>
                                            <button onClick={() => deleteOptions("episodes")}>Delete!</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <label>
                                    <motion.button
                                        type='button'
                                        onClick={() => setDeleteNotificationsClick(!deleteNotificationsClick)}
                                        variants={framerMotionBtnVariants}
                                        whileTap="tap"
                                        data-active={deleteNotificationsClick}
                                    >
                                        Delete Notifications
                                    </motion.button>
                                </label>
                                <AnimatePresence
                                    initial={false}
                                    mode='wait'
                                >
                                    {deleteNotificationsClick && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: "8px", marginBottom: "40px" }}
                                            animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                            exit={{ opacity: 0, height: 0, marginTop: "0", marginBottom: "0" }}
                                            className={styles.confirm_delete_container}
                                        >
                                            <p>Are you Sure?</p>
                                            <button type='button' onClick={() => setDeleteNotificationsClick(false)}>Cancel</button>
                                            <button onClick={() => deleteOptions("episodes")}>Delete!</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <label>
                                    <motion.button
                                        type='button'
                                        onClick={() => setDeleteAccountClick(!deleteAccountClick)}
                                        variants={framerMotionBtnVariants}
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
                                            <button onClick={() => deleteOptions("account")}>Delete!</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.9 }}
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
                    </motion.button>

                </form>

            </motion.div>
        </motion.div >
    )

}

export default UserSettingsModal