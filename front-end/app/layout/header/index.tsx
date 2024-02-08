"use client"
import React, { ChangeEvent, useId, useState } from 'react'
import styles from './headerComponent.module.css'
import Image from 'next/image'
import MenuList from '../../../public/assets/list.svg'
import SearchIcon from '../../../public/assets/search.svg'
import PersonIcon from '../../../public/assets/person-circle.svg'
import ChevronDownIcon from '../../../public/assets/chevron-down.svg'
import ChevronUpIcon from '../../../public/assets/chevron-up.svg'
import LoadingIcon from '../../../public/assets/ripple-1s-200px.svg'
import Link from 'next/link'
import API from '../../../api/anilist'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import SearchResultItemCard from '@/app/components/SearchResultItemCard'
import AnimeNavListHover from './components/AnimeNavListHover'
import MangaNavListHover from './components/MangaNavListHover'

function Header() {

    {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/ }
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)
    {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/ }
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

    // TOGGLE VISIBILITY FOR THE SIDE LIST ON MOBILE SCREENS
    const [toggleListOne, setToggleListOne] = useState<boolean>(false)
    const [toggleListTwo, setToggleListTwo] = useState<boolean>(false)

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
                    <div id={styles.menu_container}>

                        {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/}
                        <button
                            id={styles.btn_open_menu}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-controls={styles.menu_list}
                            aria-label={isMenuOpen ? 'Click to Close Menu' : 'Click to Open Menu'}
                            className={styles.heading_btn}
                        >
                            <MenuList alt="Menu Icon" width={16} height={16} />
                        </button>

                        {isMenuOpen && (
                            <div id={styles.menu_list} aria-expanded={isMenuOpen}>

                                <ul role='menu'>
                                    <li role='menuitem'>
                                        <h5
                                            className='display_flex_row align_items_center'
                                            data-opened={toggleListOne}
                                            onClick={() => setToggleListOne(!toggleListOne)}
                                        >
                                            Animes
                                            {!toggleListOne ? (
                                                <ChevronDownIcon alt="Close Animes List" width={16} height={16} />
                                            ) : (
                                                <ChevronUpIcon alt="Open Animes List" width={16} height={16} />
                                            )}
                                        </h5>

                                        <ul data-visible={toggleListOne}>
                                            <li><Link href={`/filter?type=anime&genre=action`}>Action</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=adventure`}>Adventure</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=comedy`}>Comedy</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=drama`}>Drama</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=sci-fi`}>Sci-Fi</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=thriller`}>Thriller</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=romance`}>Romance</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=slice-of-life`}>Slice of Life</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=mistery`}>Mistery</Link></li>
                                            <li><Link href={`/filter?type=anime&genre=sports`}>Sports</Link></li>
                                        </ul>
                                    </li>

                                    <li role='menuitem'>
                                        <h5
                                            className='display_flex_row align_items_center'
                                            data-opened={toggleListTwo}
                                            onClick={() => setToggleListTwo(!toggleListTwo)}
                                        >
                                            Mangas
                                            {!toggleListTwo ? (
                                                <ChevronDownIcon alt="Close Mangas List" width={16} height={16} />
                                            ) : (
                                                <ChevronUpIcon alt="Open Mangas List" width={16} height={16} />
                                            )}
                                        </h5>

                                        <ul data-visible={toggleListTwo}>
                                            <li><Link href={`/filter?type=manga&sort=trending_desc`}>Trending</Link></li>
                                            <li><Link href={`/filter?type=manga&sort=releases_desc`}>Lastest Releases</Link></li>
                                            <li><Link href={`/filter?type=manga&genre=shounen`}>Shounen</Link></li>
                                            <li><Link href={`/filter?type=manga&genre=drama`}>Genre: Drama</Link></li>
                                            <li><Link href={`/filter?type=manga&genre=slice-of-life`}>Genre: Slice of Life</Link></li>
                                            <li><Link href={`/filter?type=manga&genre=comedy`}>Genre: Comedy</Link></li>
                                            <li><Link href={`/filter?type=manga&sort=score_desc`}>Highest Rated</Link></li>
                                        </ul>
                                    </li>
                                    {/* <li role='menuitem'>Movies</li> */}
                                </ul>

                            </div>
                        )}


                        {isMenuOpen && (
                            <div id={styles.menu_overlay} onClick={() => setIsMenuOpen(!isMenuOpen)} />
                        )}
                    </div>

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

                    {/* USER -- RIGHT SIDE OF SCREEN */}
                    {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/}
                    {/* <div id={styles.user_container}>

                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            aria-controls={styles.user_menu_list}
                            aria-label={isUserMenuOpen ? 'Click to Hide User Menu' : 'Click to Show User Menu'}
                            className={styles.heading_btn}
                        >
                            <PersonIcon alt="User Icon" width={16} height={16} />
                        </button>

                        <div id={styles.user_menu_list} aria-expanded={isUserMenuOpen}>

                            <ul role='menu'>
                                <li role='menuitem'>Login</li>
                                <li role='menuitem'>Sign Up</li>
                            </ul>

                        </div>

                        <div id={styles.user_menu_overlay} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} />

                    </div> */}

                </div>
            </div>
        </header >
    )
}

export default Header