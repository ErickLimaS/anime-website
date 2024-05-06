"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import styles from "./component.module.css"
import MenuList from '@/public/assets/list.svg'
import ChevronUpIcon from '@/public/assets/chevron-up.svg'
import ChevronDownIcon from '@/public/assets/chevron-down.svg'
import { AnimatePresence, motion } from 'framer-motion'

const showUpMotion = {

    hidden: {
        x: "-100vw",
        opacity: 0
    },
    visible: {
        x: "0",
        opacity: 1,
        transition: {
            duration: 0.2
        }
    },
    exit: {
        x: "-100vw",
        opacity: 0
    }

}

const animesGenres = [
    { name: "Action", value: "action" },
    { name: "Adventure", value: "adventure" },
    { name: "Comedy", value: "comedy" },
    { name: "Drama", value: "drama" },
    { name: "Sci-Fi", value: "sci-fi" },
    { name: "Thriller", value: "thriller" },
    { name: "Romance", value: "romance" },
    { name: "Slice of Life", value: "slice-of-life" },
    { name: "Mystery", value: "mystery" },
    { name: "Sports", value: "sports" },
]

function NavListMenu() {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    // TOGGLE VISIBILITY FOR THE SIDE LIST ON MOBILE SCREENS
    const [toggleListOne, setToggleListOne] = useState<boolean>(false)
    const [toggleListTwo, setToggleListTwo] = useState<boolean>(false)

    return (
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


            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {isMenuOpen && (

                    <motion.div
                        variants={showUpMotion}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        id={styles.menu_list}
                        aria-expanded={isMenuOpen}
                    >

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
                                    {animesGenres.map((item) => (
                                        <li key={item.value} onClick={() => setIsMenuOpen(false)}>
                                            <Link href={`/search?type=tv&genre=[${item.value}]`}>{item.name}</Link>
                                        </li>
                                    ))}
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
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&sort=trending_desc`}>Trending</Link></li>
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&sort=releases_desc`}>Lastest Releases</Link></li>
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&genre=[shounen]`}>Shounen</Link></li>
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&genre=[drama]`}>Genre: Drama</Link></li>
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&genre=[slice-of-life]`}>Genre: Slice of Life</Link></li>
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&genre=[comedy]`}>Genre: Comedy</Link></li>
                                    <li onClick={() => setIsMenuOpen(false)}><Link href={`/search?type=manga&sort=score_desc`}>Highest Rated</Link></li>
                                </ul>
                            </li>

                            <li role='menuitem' onClick={() => setIsMenuOpen(false)}>

                                <Link href={`/news`}>News</Link>

                            </li>
                        </ul>

                    </motion.div>
                )}

            </AnimatePresence >
            {isMenuOpen && (
                <motion.div id={styles.menu_overlay} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            )}
        </div >
    )
}

export default NavListMenu