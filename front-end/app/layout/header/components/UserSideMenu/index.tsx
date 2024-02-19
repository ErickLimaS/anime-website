"use client"
import React, { useEffect, useState } from 'react'
import styles from './component.module.css'
import PersonIcon from '@/public/assets/person-circle.svg'
import ChevronDownSvg from '@/public/assets/chevron-down.svg'
import ChevronUpSvg from '@/public/assets/chevron-up.svg'
import LogoutSvg from '@/public/assets/logout.svg'
import SettingsSvg from '@/public/assets/gear-fill.svg'
import HistorySvg from '@/public/assets/clock-history.svg'
import BookmarkSvg from '@/public/assets/bookmark-check-fill.svg'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initFirebase } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth"
import Image from 'next/image'
import Link from 'next/link'
import UserModal from '../../../../components/UserLoginModal'

function UserSideMenu() {

    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

    // FIREBASE LOGIN 
    const app = initFirebase()

    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    useEffect(() => {
        setIsUserMenuOpen(false)
    }, [user])

    return (
        <div id={styles.user_container}>

            {!user ? (
                <>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        aria-controls={styles.user_menu_list}
                        aria-label={isUserMenuOpen ? 'Click to Hide User Menu' : 'Click to Show User Menu'}
                        className={`display_flex_row align_items_center ${styles.heading_btn}`}
                        id={styles.user_btn}
                    >
                        <PersonIcon className={styles.scale_1_6} alt="User Icon" width={16} height={16} />
                        <span>
                            {!isUserMenuOpen ?
                                <ChevronDownSvg /> : <ChevronUpSvg />
                            }
                        </span>
                    </button>

                    {isUserMenuOpen && (

                        <UserModal onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} auth={auth} provider={provider} aria-expanded={isUserMenuOpen} />

                    )}
                </>
            ) : (
                <>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        aria-controls={styles.user_menu_list}
                        aria-label={isUserMenuOpen ? 'Click to Hide User Menu' : 'Click to Show User Menu'}
                        className={`display_flex_row align_items_center ${styles.heading_btn}`}
                        id={styles.user_btn}
                    >
                        <span id={styles.img_container}>
                            <Image
                                src={user.photoURL as string}
                                fill
                                sizes='100%'
                                alt={user.displayName as string}>
                            </Image>
                        </span>
                        <span>
                            {!isUserMenuOpen ?
                                <ChevronDownSvg /> : <ChevronUpSvg />
                            }
                        </span>
                    </button>

                    {isUserMenuOpen && (
                        <div id={styles.user_menu_list} aria-expanded={isUserMenuOpen}>

                            <ul role='menu'>
                                <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                    <Link href={"/playlist"}>
                                        <BookmarkSvg width={16} height={16} alt={"Bookmarks Icon"} /> Playlist
                                    </Link>
                                </li>
                                {/* <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                    <Link href={"/history"}>
                                        <HistorySvg width={16} height={16} alt={"History Icon"} /> History
                                    </Link>
                                </li> */}
                                {/* <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                    <Link href={"/settings"}>
                                        <SettingsSvg width={16} height={16} alt={"Settings Icon"} /> Settings
                                    </Link>
                                </li> */}
                                <li role='menuitem' onClick={() => setIsUserMenuOpen(false)}>
                                    <button onClick={() => auth.signOut()}>
                                        <LogoutSvg width={16} height={16} alt={"Logout Icon"} /> Log Out
                                    </button>
                                </li>
                            </ul>

                        </div>
                    )}
                </>
            )}
        </div>

    )
}

export default UserSideMenu