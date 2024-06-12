"use client"
import React, { FormEvent, useState } from 'react'
import styles from "./component.module.css"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from '@/app/api/anilistMedias'
import SearchResultItemCard from './components/SearchResultItemCard'
import LoadingIcon from '@/public/assets/ripple-1s-200px.svg'
import SearchIcon from '@/public/assets/search.svg'
import CloseSvg from '@/public/assets/x.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import axios from 'axios'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'
import { getUserAdultContentPreference } from '@/app/lib/user/userDocFetchOptions'

const framerMotionshowUpMotion = {

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

function SearchFormContainer() {

    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchType, setSearchType] = useState<"offline" | "anilist">("offline") // OFFLINE stands for using internal NEXT API 

    const [searchResultsList, setSearchResultsList] = useState<ApiDefaultResult[] | MediaDbOffline[] | null>()

    const [searchInputValue, setSearchInputValue] = useState<string>("")

    const auth = getAuth()
    const [user] = useAuthState(auth)

    async function fetchSearchResultsOnInputChange(value: string) {

        if (searchType == "anilist") setSearchResultsList(null)

        setSearchType("offline")

        setSearchInputValue(value)

        if (value.length <= 2) return setSearchResultsList(null)

        setIsLoading(true)

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NEXT_ROUTE_HANDLER_API}?title=${value}`)

        setSearchResultsList(data.data as MediaDbOffline[])

        setIsLoading(false)

    }

    async function handleSearchFormSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault()

        setSearchType("anilist")

        setSearchResultsList(null)

        let isAdultContentAllowed = false

        if (user) isAdultContentAllowed = await getUserAdultContentPreference(user.uid)

        if (searchInputValue.length == 0) return

        setIsLoading(true)

        const searchResults = await anilist.getSeachResults({ query: searchInputValue, showAdultContent: isAdultContentAllowed })

        setSearchResultsList(searchResults as ApiDefaultResult[])

        setIsLoading(false)

    }

    function toggleMobileSearchBarVisibility(value: boolean) {

        setIsMobileSearchBarOpen(value)

        if (!value) setSearchResultsList(null)

    }

    return (
        <React.Fragment>
            <div id={styles.search_container}>

                <button
                    id={styles.btn_open_search_form_mobile}
                    onClick={() => toggleMobileSearchBarVisibility(!isMobileSearchBarOpen)}
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
                        onSubmit={(e) => handleSearchFormSubmit(e)}
                        className={`${styles.search_form} display_flex_row`}
                    >
                        <input
                            type="text"
                            placeholder='Search...'
                            name='searchField'
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            // onChange={(e) => fetchSearchResultsOnInputChange(e.target.value)}
                        />
                        <button
                            type='submit'
                            disabled={isLoading}
                            aria-label='Begin Search'
                        >
                            {isLoading ?
                                (<LoadingIcon alt="Loading Icon" width={16} height={16} />)
                                :
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
                            variants={framerMotionshowUpMotion}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >

                            <form onSubmit={(e) => handleSearchFormSubmit(e)} className={`${styles.search_form} display_flex_row`}>
                                <input
                                    type="text"
                                    placeholder='Search...'
                                    name='searchField'
                                    disabled={isLoading}
                                    onChange={(e) => setSearchInputValue(e.target.value)}
                                ></input>
                                <button type='submit' disabled={isLoading} aria-label='Begin Search'>
                                    {isLoading ?
                                        (<LoadingIcon alt="Loading Icon" width={16} height={16} />)
                                        :
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

                {(searchResultsList != null && searchResultsList.length != 0) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        id={styles.search_results_container}
                    >

                        <button onClick={() => setSearchResultsList(null)} title="Close Search Results">
                            <CloseSvg alt="Close Icon" width={16} height={16} />
                        </button>

                        <ul>
                            {(searchResultsList != null && searchResultsList.length == 0) && (
                                <li><p>No results for this search</p></li>
                            )}

                            {searchResultsList.map((item: ApiDefaultResult | MediaDbOffline, key: number) => (
                                <SearchResultItemCard
                                    key={key}
                                    mediaFromAnilist={searchType == "anilist" ? item as ApiDefaultResult : undefined}
                                    mediaFromOfflineDB={searchType == "offline" ? item as MediaDbOffline : undefined}
                                    handleChoseResult={() => toggleMobileSearchBarVisibility(false)}
                                />
                            ))}
                        </ul>

                    </motion.div>
                )}
            </AnimatePresence>
        </React.Fragment>
    )
}

export default SearchFormContainer