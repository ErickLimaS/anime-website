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
import { initFirebase } from '@/firebase/firebaseApp'
import { Auth, deleteUser, updateProfile } from 'firebase/auth'
import Image from 'next/image'

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

    const [openUserProfilePanel, setOpenUserProfilePanel] = useState<boolean>(false)
    const [newImgProfileSelected, setNewImgProfileSelected] = useState<string | null>(null)

    const [deleteBookmarksClick, setDeleteBookmarksClick] = useState<boolean>(false)
    const [deleteEpisodesClick, setDeleteEpisodessClick] = useState<boolean>(false)
    const [deleteAccountClick, setDeleteAccountClick] = useState<boolean>(false)

    const [currentLang, setCurrentLang] = useState<string | null>(null)
    const [currentSource, setCurrentSource] = useState<string | null>(null)
    const [currentQuality, setCurrentQuality] = useState<string | null>(null)
    const [currentShowAdultContent, setCurrentShowAdultContent] = useState<boolean | null>(null)
    const [currentSkipIntroAndOutro, setCurrentSkipIntroAndOutro] = useState<boolean | null>(null)
    const [currentNextEpisode, setCurrentNextEpisode] = useState<boolean | null>(null)

    const db = getFirestore(initFirebase());

    const btnVariants = {

        tap: {
            scale: 0.9
        }

    }

    const languagesOptions = [

        { name: "Arabic", value: "Arabic" },
        { name: "Chinese", value: "Chinese" },
        { name: "Croatian", value: "Croatian" },
        { name: "Danish", value: "Danish" },
        { name: "Dutch", value: "Dutch" },
        { name: "English", value: "English" },
        { name: "Finnish", value: "Finnish" },
        { name: "French", value: "French" },
        { name: "German", value: "German" },
        { name: "Greek", value: "Greek" },
        { name: "Hindi", value: "Hindi" },
        { name: "Hebrew", value: "Hebrew" },
        { name: "Hugarian", value: "Hugarian" },
        { name: "Indonisian", value: "Indonisian" },
        { name: "Italian", value: "Italian" },
        { name: "Japanese", value: "Japanese" },
        { name: "Korean", value: "Korean" },
        { name: "Malay", value: "Malay" },
        { name: "Norwegian", value: "Norwegian" },
        { name: "Polish", value: "Polish" },
        { name: "Portuguese", value: "Portuguese" },
        { name: "Romanian", value: "Romanian" },
        { name: "Russian", value: "Russian" },
        { name: "Spanish", value: "Spanish" },
        { name: "Swedish", value: "Swedish" },
        { name: "Thai", value: "Thai" },
        { name: "Turkish", value: "Turkish" },
        { name: "Ukrainian", value: "Ukrainian" },

    ]

    const imagesOptions = [

        { name: "Naruto", value: "https://staticg.sportskeeda.com/editor/2023/07/90f02-16887293481353-1920.jpg?w=840" },
        { name: "Sasuke", value: "https://i.pinimg.com/736x/1d/67/b1/1d67b12e9aa9837e5e6bbeb9c4a7de6a.jpg" },
        { name: "Sakura", value: "https://i.pinimg.com/736x/7d/6e/eb/7d6eeb79b0b43bb0987bf4c6935fa148.jpg" },
        { name: "Orochimaru", value: "https://i.pinimg.com/736x/46/96/2c/46962c4c09748dee70bad0151bd780f2.jpg" },
        { name: "Goku", value: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mWj71ZXtaNlw17vZ9-grd9PXx6u59fVP3CBing7za9sf3ioZ5AZC7poY9KKgsQ5H4j0" },
        { name: "Vegeta", value: "https://i.pinimg.com/originals/82/fe/68/82fe682632ade16ee6c8f812f7654e39.jpg" },
        { name: "Luffy", value: "https://pbs.twimg.com/profile_images/1565724526503424000/TbLcrB1g_400x400.jpg" },
        { name: "Zoro", value: "https://i.pinimg.com/736x/e6/67/3f/e6673fc4f4930a84277c3f88bc87978e.jpg" },
        { name: "Tanjiro", value: " https://www.batamnews.co.id/foto_berita//74yaoiba.jpg" },
        { name: "Zenitsu ", value: "https://i.pinimg.com/1200x/ce/45/de/ce45dee27e0b84ce0b673cc64e7b0db4.jpg" },
        { name: "Nezuko", value: "https://referencianerd.com/wp-content/uploads/2020/03/Nezuko-Kamado.jpg" },
        { name: "Rengoku", value: "https://wallpapers-clan.com/wp-content/uploads/2023/07/demon-slayer-rengoku-2-pfp-03.jpg" },
        { name: "Kuroko", value: "https://i.pinimg.com/736x/15/f4/bc/15f4bcb261ae17c4c58896eccdfced6b.jpg" },
        { name: "Kagami", value: "https://i.pinimg.com/736x/58/e9/b7/58e9b7f8c80684809651f65fef96bf88.jpg" },
        { name: "Kilua", value: "https://pbs.twimg.com/media/EWWBpLJX0AYu6Ph.jpg" },
        { name: "Gon", value: "https://i.pinimg.com/1200x/eb/6d/ac/eb6dace372c72a61b58313fdb7e01053.jpg" },
        { name: "Hisoka", value: "https://static.wikia.nocookie.net/hunterxhunter/images/2/29/Hisoka_Morow_YC_Portrait.png/revision/latest?cb=20190123172039" },
        { name: "Gon", value: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOBHFT7nggN11EYtTIMqsvrM6kDdKvX57IAw" },
        { name: "Kaneki", value: "https://i.pinimg.com/736x/28/c6/d1/28c6d1b1ba52d55b2ba5f6618d8a0907.jpg" },
        { name: "Kaneki", value: "https://i.pinimg.com/236x/0f/79/a9/0f79a98a5321f26ee102b18fd002a1c0.jpg" },
        { name: "Ichigo", value: "https://e0.pxfuel.com/wallpapers/263/836/desktop-wallpaper-cool-bleach-anime-anime-profile.jpg" },
        { name: "Ichigo", value: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdcvuS6sprbhx7QosddiutilT2Gn69PD8ch_cGWi2xhcaD3sU6cQB0JnEA46mgnebuZlM" },
        { name: "Ichigo", value: "https://bandodequadrados.com/img/imagem_noticia/parte-2-de-bleach-thousand-year-blood-war-ganha-teaser-e-data-de-estreia-20221228103701.jpg" },

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
                videoQuality: form.quality.value,
                showAdultContent: form.showAdultContent.checked,
                autoNextEpisode: form.autoNextEpisode.checked,
                autoSkipIntroAndOutro: form.skipIntroAndOutro.checked
            }
        )

        // update user info
        if (newImgProfileSelected || form.username.value) {

            await updateProfile(user, {
                photoURL: newImgProfileSelected || user.photoURL,
                displayName: form.username.value || user.displayName
            })

        }

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
        setCurrentShowAdultContent(await data.get("showAdultContent") || false)
        setCurrentSkipIntroAndOutro(await data.get("autoSkipIntroAndOutro") || false)
        setCurrentNextEpisode(await data.get("autoNextEpisode") || false)

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

                <motion.button
                    title="Close Settings"
                    onClick={onClick as any}
                    id={styles.close_menu_btn}
                    variants={btnVariants}
                    whileTap={"tap"}
                >
                    <CloseSvg alt="Close" width={16} height={16} />
                </motion.button>

                <form onSubmit={(e) => changeSettings(e)}>

                    <div className={styles.group_container}>
                        <h5><span><UserSvg alt="Person" width={16} height={16} /></span> User Account</h5>

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
                                                // height={140} width={140}
                                                fill
                                            />
                                        </label>
                                    </>
                                )}
                            </div>

                            <div>
                                {user && (
                                    <label>
                                        Change Username
                                        <input
                                            type='text'
                                            name='username'
                                            placeholder={user.displayName as string}
                                        ></input>
                                    </label>
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

                                    {imagesOptions.map((item, key) => (

                                        <motion.div
                                            key={key}
                                            className={styles.img_checkbox}
                                            variants={btnVariants}
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
                                            {sourcesOptions.map((item, key) => (
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

                    <div >
                        <h5 style={{ marginBottom: "16px" }}>
                            <span><DeleteSvg alt="Play" width={16} height={16} /></span> Delete <span style={{ color: "var(--white-75)" }}>(can not be reverted!)</span>
                        </h5>

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