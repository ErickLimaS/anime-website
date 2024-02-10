"use client"
import React, { ChangeEvent, useId, useState } from 'react'
import styles from './headerComponent.module.css'
import Image from 'next/image'
import SearchIcon from '../../../public/assets/search.svg'
import ChevronDownIcon from '../../../public/assets/chevron-down.svg'
import LoadingIcon from '../../../public/assets/ripple-1s-200px.svg'
import Link from 'next/link'
import API from '../../../api/anilist'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import SearchResultItemCard from '@/app/components/SearchResultItemCard'
import AnimeNavListHover from './components/AnimeNavListHover'
import MangaNavListHover from './components/MangaNavListHover'
import UserSideMenu from './components/UserSideMenu'
import NavListMenu from './components/NavListMenu'

function Header() {

    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchResults, setSearchResults] = useState<ApiDefaultResult[] | null>()

    const [searchInput, setSearchInput] = useState<string>("")

    const id = useId()

    async function searchValue(e: React.ChangeEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        const query = searchInput

        if (query.length == 0) return

        setIsLoading(true)

        const result = await API.getSeachResults(query)

        setSearchResults(result as ApiDefaultResult[])

        setIsLoading(false)

    }

    // when clicked, shows serch bar and results, 
    // if clicked again, hide both and erase search results
    function toggleSearchBarMobile() {

        setIsMobileSearchBarOpen(!isMobileSearchBarOpen)
        setSearchResults(null)

    }

    return (
        <header id={styles.background} className={id}>

            <div id={styles.container} className='display_flex_row padding_16px'>

                <div id={styles.menu_and_logo_container} className='display_flex_row align_items_center'>

                    {/* MENU NAVIGATION -- SCREEN LEFT SIDE */}
                    <NavListMenu />

                    <Link href="/" id={styles.img_container}>
                        <Image id={styles.logo} src={'/logo.png'} alt='AniProject Website Logo' fill />
                    </Link>
                </div>

                {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/}
                <div id={styles.navbar_container} className={`align_items_center`}>
                    <ul className='display_grid'>

                        <li className='display_flex_row align_items_center'>
                            Animes <ChevronDownIcon alt="Open Animes List" width={16} height={16} />

                            <AnimeNavListHover />

                        </li>

                        <li className='display_flex_row align_items_center'>
                            Mangas <ChevronDownIcon alt="Open Mangas List" width={16} height={16} />

                            <MangaNavListHover />
                        </li>
                        {/* <li className='display_flex_row align_items_center'>
                            Movies <ChevronDownIcon alt="Open Movies List" width={16} height={16} />
                        </li> */}
                    </ul>
                </div>

                <div id={styles.user_and_search_container} className='display_flex_row align_items_center gap_16px'>

                    <div id={styles.search_container}>

                        <button
                            id={styles.btn_open_search_form_mobile}
                            onClick={() => toggleSearchBarMobile()}
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
                                <button type='submit' disabled={isLoading}>
                                    {isLoading ?
                                        (<LoadingIcon alt="Loading Icon" width={16} height={16} />) :
                                        (<SearchIcon alt="Search Icon" width={16} height={16} />)
                                    }
                                </button>
                            </form>

                        </div>

                        {/* MOBILE */}
                        {isMobileSearchBarOpen && (
                            <div id={styles.form_mobile_search} aria-expanded={isMobileSearchBarOpen} className='display_align_justify_center'>

                                <form onSubmit={(e) => searchValue(e as HTMLFormElement | ChangeEvent<HTMLFormElement>)} className={`${styles.search_form} display_flex_row`}>
                                    <input type="text" placeholder='Search...' name='searchField' disabled={isLoading} onChange={(e) => setSearchInput(e.target.value)}></input>
                                    <button type='submit' disabled={isLoading}>
                                        {isLoading ?
                                            (<LoadingIcon alt="Loading Icon" width={16} height={16} />) :
                                            (<SearchIcon alt="Search Icon" width={16} height={16} />)
                                        }
                                    </button>
                                </form>

                            </div>
                        )}

                    </div>

                    {/* SEARCH RESULTS */}
                    {searchResults != null && (
                        <div id={styles.search_results_container}>

                            <button onClick={() => setSearchResults(null)}>Clear Search</button>

                            <ul>
                                {searchResults.slice(0, 6).map((item: ApiDefaultResult, key: number) => (
                                    <SearchResultItemCard key={key} item={item} />
                                ))}
                            </ul>

                        </div>
                    )}

                    {/* USER MENU -- RIGHT SIDE OF SCREEN */}
                    <UserSideMenu />

                </div>
            </div>
        </header >
    )
}

export default Header