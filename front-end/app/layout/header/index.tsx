"use client"
import React, { useState } from 'react'
import styles from './headerComponent.module.css'
import Image from 'next/image'
import MenuList from '../../../public/assets/list.svg'
import SearchIcon from '../../../public/assets/search.svg'
import PersonIcon from '../../../public/assets/person-circle.svg'
import ChevronDownIcon from '../../../public/assets/chevron-down.svg'
import Link from 'next/link'

function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

    function searchValue() {

    }

    return (
        <header id={styles.background} >

            <div id={styles.container} className='display_flex_row padding_16px'>

                <div id={styles.menu_and_logo_container} className='display_flex_row align_items_center gap_16px'>
                    <div id={styles.menu_container}>

                        <button
                            id={styles.btn_open_menu}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-controls={styles.menu_list}
                            aria-label={isMenuOpen ? 'Click to Close Menu' : 'Click to Open Menu'}
                            className={styles.heading_btn}
                        >
                            <MenuList alt="Menu Icon" width={16} height={16} />
                        </button>

                        <div id={styles.menu_list} aria-expanded={isMenuOpen}>

                            <ul role='menu'>
                                <li role='menuitem'>Animes</li>
                                <li role='menuitem'>Mangas</li>
                                <li role='menuitem'>Movies</li>
                            </ul>

                        </div>

                        <div id={styles.menu_overlay} onClick={() => setIsMenuOpen(!isMenuOpen)} />

                    </div>

                    <Link href="/">
                        <Image id={styles.logo} src={'/logo.png'} alt='Aniproject Website Logo' width={120} height={40} />
                    </Link>
                </div>

                <div id={styles.navbar_container} className={`align_items_center`}>
                    <ul className='display_grid'>
                        <li>Animes <ChevronDownIcon alt="Open List" width={16} height={16} /></li>
                        <li>Mangas <ChevronDownIcon alt="Open List" width={16} height={16} /></li>
                        <li>Movies <ChevronDownIcon alt="Open List" width={16} height={16} /></li>
                    </ul>
                </div>

                <div id={styles.user_and_search_container} className='display_flex_row align_items_center gap_16px'>

                    <div id={styles.search_container}>

                        <button
                            id={styles.btn_open_search_form_mobile}
                            onClick={() => setIsMobileSearchBarOpen(!isMobileSearchBarOpen)}
                            aria-controls={styles.input_search_bar}
                            aria-label={isMobileSearchBarOpen ? 'Click to Hide Search Bar' : 'Click to Show Search Bar'}
                            className={styles.heading_btn}
                        >
                            <SearchIcon alt="Search Icon" width={16} height={16} />
                        </button>

                        {/* TABLET AND DESKTOP */}
                        <div id={styles.form_search}>

                            <form onSubmit={() => searchValue()} className={`${styles.search_form} display_flex_row`}>
                                <input type="text" placeholder='Search...' name='searchField'></input>
                                <button type='submit'>
                                    <SearchIcon alt="Search Icon" width={16} height={16} />
                                </button>
                            </form>

                        </div>

                        {/* MOBILE */}
                        <div id={styles.form_mobile_search} aria-expanded={isMobileSearchBarOpen} className='display_align_justify_center'>

                            <form onSubmit={() => searchValue()} className={`${styles.search_form} display_flex_row`}>
                                <input type="text" placeholder='Search...' name='searchField'></input>
                                <button type='submit'>
                                    <SearchIcon alt="Search Icon" width={16} height={16} />
                                </button>
                            </form>

                        </div>

                    </div>

                    <div id={styles.user_container}>

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

                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header