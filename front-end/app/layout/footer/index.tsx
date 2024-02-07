import React from 'react'
import styles from "./footerComponent.module.css"
import Link from 'next/link'
import Image from 'next/image'
import Facebook from "../../../public/assets/facebook.svg"
import Instagram from "../../../public/assets/instagram.svg"
import Youtube from "../../../public/assets/youtube.svg"
import Twitter from "../../../public/assets/twitter-x.svg"
import API from '../../../api/anilist'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'

async function Footer() {

    const data = await API.getReleasingThisWeek("ANIME")

    return (
        <footer id={styles.footer}>

            <section id={styles.info_container}>

                <div id={styles.social_links_container} className='display_flex_row'>

                    <Link id={styles.img_container} href="/">
                        <Image src='/logo.png' alt="Aniproject Site Logo" fill></Image>
                    </Link>

                    <div id={styles.social_media_container}>

                        <ul className='display_flex_row'>
                            <li><Link href="#"><Facebook width={16} height={16} /> Facebook</Link></li>
                            <li><Link href="#"><Twitter width={16} height={16} /> Twitter</Link></li>
                            <li><Link href="#"><Instagram width={16} height={16} /> Instagram</Link></li>
                            <li><Link href="#"><Youtube width={16} height={16} /> YouTube</Link></li>
                        </ul>

                    </div>

                </div>

                <span id={styles.span_border1}></span>

                <div id={styles.nav_links_container}>
                    <div className={styles.list_container}>
                        <h5>Categories</h5>

                        <ul className={`${styles.grid_template} display_grid`}>
                            <li><Link href="/genre/action">Action</Link></li>
                            <li><Link href="/genre/adventure">Adventure</Link></li>
                            <li><Link href="/genre/drama">Drama</Link></li>
                            <li><Link href="/genre/sci-fi">Sci-fi</Link></li>
                            <li><Link href="/genre/comedy">Comedy</Link></li>
                            <li><Link href="/genre/slice-of-life">Slice of Life</Link></li>
                            <li><Link href="/genre/mistery">Mistery</Link></li>
                            <li><Link href="/genre/supernatural">Supernatural</Link></li>
                            <li><Link href="/genre/romance">Romance</Link></li>
                            <li><Link href="/genre/sports">Sports</Link></li>
                        </ul>

                    </div>

                    <div className={styles.list_container}>
                        <h5>Airing This Week</h5>

                        <ul className={`${styles.grid_template} display_grid`}>
                            {data != undefined && (
                                data.slice(0, 10).map((item, key: number) => (
                                    <li key={key}><Link href={`/media/${item.id}`}>{item.title.romaji}</Link></li>
                                )))
                            }
                        </ul>

                    </div>


                    <div className='display_flex_row'>

                        <span id={styles.span_border2}></span>

                        <div id={styles.div_custom_margin}>
                            <h5>About</h5>

                            <ul>
                                <li><Link href="https://github.com/ErickLimaS/anime-website/" target='_blank'>This Project</Link></li>
                                <li><Link href="https://anilist.gitbook.io/anilist-apiv2-docs/" target='_blank'>AniList API</Link></li>
                                <li><Link href="https://docs.consumet.org/" target='_blank'>Consumet API</Link></li>
                                <li><Link href="https://preview.themeforest.net/item/vodi-video-wordpress-theme-for-movies-tv-shows/full_screen_preview/23738703" target='_blank'>Inspiration 1</Link></li>
                                <li><Link href="https://dribbble.com/shots/20333170-The-Trailers-Concept-Site-Part-2" target='_blank'>Inspiration 2</Link></li>
                            </ul>
                        </div>

                    </div>

                </div>

            </section>

            <section id={styles.copyright_section} className=''>

                <div className='center display_flex_row'>
                    <div>
                        <small>Copyright © 2024, AniProject. All Rights Reserved</small>
                    </div>

                    <div>
                        <Link href="#"><small>Privacy Police</small></Link>
                    </div>
                </div>

            </section>

        </footer>
    )
}

export default Footer