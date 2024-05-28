"use client"
import React, { useState } from 'react'
import styles from './component.module.css'
import PersonIcon from '@/public/assets/person-circle.svg'
import ChevronDownSvg from '@/public/assets/chevron-down.svg'
import ChevronUpSvg from '@/public/assets/chevron-up.svg'
import LogoutSvg from '@/public/assets/logout.svg'
import SettingsSvg from '@/public/assets/gear-fill.svg'
import HistorySvg from '@/public/assets/clock-history.svg'
import BookmarkSvg from '@/public/assets/bookmark-check-fill.svg'
import LoadingSvg from '@/public/assets/Eclipse-1s-200px.svg'
import { getAuth } from 'firebase/auth'
import { useAuthState } from "react-firebase-hooks/auth"
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import UserSettingsModal from '../UserSettingsModal'
import ShowUpLoginPanelAnimated from '@/app/components/UserLoginModal/animatedVariant'

const framerMotionShowUp = {

    hidden: {
        y: "-40px",
        opacity: 0
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.2
        }
    },
    exit: {
        opacity: 0,
    }

}

function UserSideMenu() {

    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
    const [isUserLoginOpen, setIsUserLoginOpen] = useState<boolean>(false)
    const [isUserSettingsOpen, setIsUserSettingsOpen] = useState<boolean>(false)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    return (
        <div id={styles.user_container}>

            <ShowUpLoginPanelAnimated
                apperanceCondition={isUserLoginOpen}
                customOnClickAction={() => setIsUserLoginOpen(!isUserLoginOpen)}
                auth={auth}
            />

            {!user && (
                <React.Fragment>
                    <button
                        onClick={() => setIsUserLoginOpen(!isUserLoginOpen)}
                        aria-controls={styles.user_menu_list}
                        aria-label={isUserMenuOpen ? 'Click to Hide User Menu' : 'Click to Show User Menu'}
                        className={`display_flex_row align_items_center ${styles.heading_btn}`}
                        id={styles.user_btn}
                        data-useractive={false}
                        data-loading={loading}
                    >

                        {loading && (
                            <LoadingSvg width={16} height={16} title="Loading" />
                        )}

                        {!loading && (
                            <React.Fragment>
                                <PersonIcon className={styles.scale} alt="User Icon" width={16} height={16} />
                                <span>
                                    Login
                                </span>
                            </React.Fragment>
                        )}

                    </button>

                </React.Fragment>
            )}

            {user && (
                <React.Fragment>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        aria-controls={styles.user_menu_list}
                        aria-label={isUserMenuOpen ? 'Click to Hide User Menu' : 'Click to Show User Menu'}
                        className={`display_flex_row align_items_center ${styles.heading_btn} ${isUserMenuOpen ? `${styles.active}` : ""}`}
                        id={styles.user_btn}
                        data-useractive={true}
                    >
                        <span id={styles.img_container}>
                            <Image
                                src={user.photoURL ? user.photoURL as string : "https://i.pinimg.com/736x/fc/4e/f7/fc4ef7ec7265a1ebb69b4b8d23982d9d.jpg"}
                                alt={user.displayName as string}
                                fill
                                sizes='32px'
                            >
                            </Image>
                        </span>
                        <span>
                            {!isUserMenuOpen ?
                                <ChevronDownSvg /> : <ChevronUpSvg />
                            }
                        </span>
                    </button>

                    <AnimatePresence
                        initial={false}
                        mode='wait'
                    >
                        {isUserMenuOpen && (
                            <motion.div
                                variants={framerMotionShowUp}
                                id={styles.user_menu_list}
                                aria-expanded={isUserMenuOpen}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >

                                <ul role='menu'>
                                    <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                        <Link href={"/watchlist"}>
                                            <BookmarkSvg width={16} height={16} alt={"Watchlist Icon"} /> Watchlist
                                        </Link>
                                    </li>
                                    <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                        <Link href={"/history"}>
                                            <HistorySvg width={16} height={16} alt={"History Icon"} /> Latests Watched
                                        </Link>
                                    </li>
                                    <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                        <button onClick={() => setIsUserSettingsOpen(true)}>
                                            <SettingsSvg width={16} height={16} alt={"Settings Icon"} /> Settings
                                        </button>
                                    </li>
                                    <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                        <button onClick={() => auth.signOut()}>
                                            <LogoutSvg width={16} height={16} alt={"Logout Icon"} /> Log Out
                                        </button>
                                    </li>
                                </ul>

                            </motion.div>
                        )}

                        {isUserSettingsOpen && (

                            <UserSettingsModal
                                onClick={() => setIsUserSettingsOpen(!isUserSettingsOpen)}
                                auth={auth}
                                aria-expanded={isUserSettingsOpen}
                            />

                        )}

                    </AnimatePresence>
                </React.Fragment>
            )}
        </div>

    )
}

export default UserSideMenu