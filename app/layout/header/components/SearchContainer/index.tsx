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
import { initFirebase } from '@/app/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import axios from 'axios'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'

function SearchContainer() {

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchType, setSearchType] = useState<"offline" | "anilist">("offline")
    const [searchResults, setSearchResults] = useState<ApiDefaultResult[] | MediaDbOffline[] | null>()

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

    async function fetchResultsOnChange(value: string) {

        if (searchType == "anilist") setSearchResults(null)

        setSearchType("offline")

        setSearchInput(value)

        if (value.length <= 2) return setSearchResults(null)

        setIsLoading(true)

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NEXT_INTERNAL_API_URL}?title=${value}`)

        setSearchResults(data.data as MediaDbOffline[])

        setIsLoading(false)

    }

    async function searchValue(e: React.ChangeEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        setSearchType("anilist")

        setSearchResults(null)

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

    // when clicked, shows serch bar and results
    function toggleSearchBarMobile(action: boolean) {

        setIsMobileSearchBarOpen(action)

        if (action == false) {
            setSearchResults(null)
        }

    }

    return (
        <>
            <div id={styles.search_container}>

                <button
                    id={styles.btn_open_search_form_mobile}
                    onClick={() => toggleSearchBarMobile(!isMobileSearchBarOpen)}
                    aria-controls={styles.input_search_bar}
                    data-active={isMobileSearchBarOpen}
                    aria-label={isMobileSearchBarOpen ? 'Click to Hide Search Bar' : 'Click to Show Search Bar'}
                    className={styles.heading_btn}
                >
                    <SearchIcon alt="Search Icon" width={16} height={16} />
                </button>

                {/* TABLET AND DESKTOP */}
                <div id={styles.form_search}>

                    <form
                        onSubmit={(e) => searchValue(e as HTMLFormElement | ChangeEvent<HTMLFormElement>)}
                        className={`${styles.search_form} display_flex_row`}
                    >
                        <input
                            type="text"
                            placeholder='Search...'
                            name='searchField'
                            onChange={(e) => fetchResultsOnChange(e.target.value)}
                        />
                        <button
                            type='submit'
                            disabled={isLoading}
                            aria-label='Begin Search'
                        >
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
            <AnimatePresence
                initial={false}
                mode='wait'
            >

                {(searchResults != null && searchResults.length != 0) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        id={styles.search_results_container}
                    >

                        <button onClick={() => setSearchResults(null)} title="Close Search Results">
                            <CloseSvg alt="Close Icon" width={16} height={16} />
                        </button>

                        <ul>
                            {(searchResults != null && searchResults.length == 0) && (
                                <li><p>No results for this search</p></li>
                            )}

                            {searchResults.map((item: ApiDefaultResult | MediaDbOffline, key: number) => (
                                <SearchResultItemCard
                                    key={key}
                                    itemAnilist={searchType == "anilist" ? item as ApiDefaultResult : undefined}
                                    itemOfflineDb={searchType == "offline" ? item as MediaDbOffline : undefined}
                                    onClick={() => toggleSearchBarMobile(false)}
                                />
                            ))}
                        </ul>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default SearchContainer