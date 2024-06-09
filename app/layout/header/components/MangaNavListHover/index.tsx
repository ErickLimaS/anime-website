import React from 'react'
import styles from "./component.module.css"
import * as MediaInfoExpanded from '@/app/components/MediaCards/MediaInfoExpandedWithCover'
import Link from 'next/link'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"

function MangaNavListHover({ mangaList }: { mangaList: ApiDefaultResult[] }) {

    return (
        <ul id={styles.manga_header_nav_container}>
            <li>
                <div id={styles.topics_container}>
                    <ul>
                        <li>
                            <Link href={`/search?type=manga&sort=trending_desc`}>
                                Trending
                            </Link>
                        </li>
                        <li>
                            <Link href={`/search?type=manga&sort=releases_desc`}>
                                Lastest Releases
                            </Link>
                        </li>
                        <li>
                            <Link href={`/search?type=manga&genre=[shounen]`}>
                                Shounen
                            </Link>
                        </li>
                        <li>
                            <Link href={`/search?type=manga&genre=[drama]`}>
                                Genre: Drama
                            </Link>
                        </li>
                        <li>
                            <Link href={`/search?type=manga&genre=[slice-of-life]`}>
                                Genre: Slice of Life
                            </Link>
                        </li>
                        <li>
                            <Link href={`/search?type=manga&genre=[comedy]`}>
                                Genre: Comedy
                            </Link>
                        </li>
                        <li>
                            <Link href={`/search?type=manga&sort=score_desc`}>
                                Highest Rated
                            </Link>
                        </li>
                    </ul>
                </div>

                <div id={styles.manga_card_container}>
                    <h5>Manga of the Day</h5>

                    {mangaList ? (
                        <MediaInfoExpanded.Container
                            mediaInfo={mangaList[0]}
                        >

                            <MediaInfoExpanded.Description
                                description={mangaList[0].description}
                            />

                            <MediaInfoExpanded.Buttons
                                media={mangaList[0]}
                                mediaFormat={mangaList[0].format}
                                mediaId={mangaList[0].id}
                            />

                        </MediaInfoExpanded.Container>
                    ) : (
                        <LoadingSvg />
                    )}
                </div>

                <div id={styles.list_picked_container}>
                    <h5>Picked for you</h5>

                    {mangaList ? (
                        <ul>
                            {mangaList?.slice(1, 6).map((media) => (
                                <li key={media.id}>

                                    <MediaCard.Container>

                                        <MediaCard.MediaImgLink
                                            mediaId={media.id}
                                            title={media.title.userPreferred}
                                            formatOrType={media.format}
                                            url={media.coverImage.large}
                                        />

                                        <MediaCard.SmallTag
                                            seasonYear={media.seasonYear}
                                            tags={media.genres[0]}
                                        />

                                        <MediaCard.LinkTitle
                                            title={media.title.userPreferred}
                                            id={media.id}
                                        />

                                    </MediaCard.Container>

                                </li>
                            ))}
                        </ul>
                    ) : (
                        <LoadingSvg />
                    )}
                </div>

            </li>
        </ul>
    )
}

export default MangaNavListHover