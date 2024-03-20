"use client"
import React, { ChangeEvent, useState } from 'react'
import styles from "./component.module.css"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from '@/api/anilist'
import SearchResultItemCard from '@/app/layout/header/components/SearchResultItemCard'
import LoadingIcon from '@/public/assets/ripple-1s-200px.svg'
import SearchIcon from '@/public/assets/search.svg'
import CloseSvg from '@/public/assets/x.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/firebase/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

function SearchContainer() {

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchResults, setSearchResults] = useState<ApiDefaultResult[] | null>()

    const [searchInput, setSearchInput] = useState<string>("")

    const showUpMotion = {

        hidden: {
            y: "-40px",
            opacity: 0
        },
        visible: {
            y: "0",
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            y: "-120px"
        }

    }

    async function searchValue(e: React.ChangeEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        let showAdultContent = false

        if (user) {

            showAdultContent = await getDoc(doc(db, 'users', user!.uid)).then(doc => doc.get("showAdultContent"))

        }

        const query = searchInput

        if (query.length == 0) return

        setIsLoading(true)

        const result = await anilist.getSeachResults(query, showAdultContent)

        setSearchResults(result as ApiDefaultResult[])

        setIsLoading(false)

    }

    // when clicked, shows serch bar and results, 
    // if clicked again, hide both and erase search results
    function toggleSearchBarMobile(action: boolean) {

        setIsMobileSearchBarOpen(action)
        setSearchResults(null)

    }

    return (
        <>
            <div id={styles.search_container}>

                <button
                    id={styles.btn_open_search_form_mobile}
                    onClick={() => toggleSearchBarMobile(true)}
                    aria-controls={styles.input_search_bar}
                    aria-label={isMobileSearchBarOpen ? 'Click to Hide Search Bar' : 'Click to Show Search Bar'}
                    className={styles.heading_btn}
                >
                    <SearchIcon alt="Search Icon" width={16} height={16} />
                </button>

                {/* TABLET AND DESKTOP */}
                <div id={styles.form_search}>

                    <form onSubmit={(e) => searchValue(e as HTMLFormElement | ChangeEvent<HTMLFormElement>)} className={`${styles.search_form} display_flex_row`}>
                        <input type="text" placeholder='Search...' name='searchField' disabled={isLoading} onChange={(e) => setSearchInput(e.target.value)}></input>
                        <button type='submit' disabled={isLoading} aria-label='Begin Search'>
                            {isLoading ?
                                (<LoadingIcon alt="Loading Icon" width={16} height={16} />) :
                                (<SearchIcon alt="Search Icon" width={16} height={16} />)
                            }
                        </button>
                    </form>

                </div>

                {/* MOBILE */}
                <AnimatePresence
                    initial={false}
                    mode='wait'
                >
                    {isMobileSearchBarOpen && (
                        <motion.div
                            id={styles.form_mobile_search}
                            aria-expanded={isMobileSearchBarOpen}
                            className='display_align_justify_center'
                            variants={showUpMotion}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >

                            <form onSubmit={(e) => searchValue(e as HTMLFormElement | ChangeEvent<HTMLFormElement>)} className={`${styles.search_form} display_flex_row`}>
                                <input type="text" placeholder='Search...' name='searchField' disabled={isLoading} onChange={(e) => setSearchInput(e.target.value)}></input>
                                <button type='submit' disabled={isLoading} aria-label='Begin Search'>
                                    {isLoading ?
                                        (<LoadingIcon alt="Loading Icon" width={16} height={16} />) :
                                        (<SearchIcon alt="Search Icon" width={16} height={16} />)
                                    }
                                </button>
                            </form>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* SEARCH RESULTS */}
            {searchResults != null && (
                <div id={styles.search_results_container}>

                    <button onClick={() => setSearchResults(null)} title="Close Search Results">
                        <CloseSvg alt="Close Icon" width={16} height={16} />
                    </button>

                    <ul>
                        {searchResults.slice(0, 6).map((item: ApiDefaultResult, key: number) => (
                            <SearchResultItemCard
                                key={key}
                                item={item}
                                onClick={() => toggleSearchBarMobile(false)}
                            />
                        ))}
                    </ul>

                </div>
            )}
        </>
    )
}

export default SearchContainer