"use client"
import React, { SetStateAction, useEffect, useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import { ApiAiringMidiaResults } from '@/app/ts/interfaces/apiDataInterface'
import API from '@/api/anilist'
import MediaItemCoverInfo from '../MediaItemCoverInfo'
import ChevronLeftIcon from '../../../public/assets/chevron-left.svg'
import ChevronRightIcon from '../../../public/assets/chevron-right.svg'
import { convertToUnix } from '@/app/lib/format_date_unix'

function NavThoughMidiasByTimeRange() {

    // 1: 1 day (today), 7: 7 days (week), 30: 30 days (month)
    const [daysRange, setDaysRange] = useState<number | null>(null)
    const [data, setData] = useState<ApiAiringMidiaResults[] | null>(null)

    useEffect(() => {
        getMidiaByDaysRange(1)
    }, [])

    // gets the range of days than parse it to unix, runs function to get any midia releasing in the selected range
    async function getMidiaByDaysRange(days: number) {

        if (days == daysRange) return

        const response = await API.getReleasingByDaysRange("ANIME", convertToUnix(days)).then(
            res => (res as ApiAiringMidiaResults[]).filter((item) => item.media.isAdult == false)
        );

        setData(response)

        setDaysRange(days as SetStateAction<number | null>)
    }

    return (
        <>
            <div id={styles.nav_tabs_container}>

                <ul className='display_flex_row'>
                    <li><button data-active={daysRange == 1} onClick={() => getMidiaByDaysRange(1)}>Today</button></li>
                    <span>/</span>
                    <li><button data-active={daysRange == 7} onClick={() => getMidiaByDaysRange(7)}>This week</button></li>
                    <span>/</span>
                    <li><button data-active={daysRange == 30} onClick={() => getMidiaByDaysRange(30)}>Last 30 days</button></li>
                </ul>

            </div>

            <div id={styles.itens_container}>

                {data != null ? (
                    data.slice(0, 8).map((item: ApiAiringMidiaResults, key: number) => (
                        <MediaItemCoverInfo key={key} data={item.media} positionIndex={key + 1} />
                    ))
                ) : (
                    <p className='display_align_justify_center'>Nothing Releasing Today</p>
                )}

                <div id={styles.nav_title_buttons_container}>

                    <h3>Latest Releases</h3>

                    <div id={styles.buttons_container} className='display_flex_row display_align_justify_center'>
                        <button><ChevronLeftIcon alt="Icon Facing Left" /></button>
                        <button><ChevronRightIcon alt="Icon Facing Right" /></button>
                    </div>

                    <Link href={`/releases/`} className='display_align_justify_center'>VIEW ALL <ChevronRightIcon alt="Icon Facing Right" /></Link>
                </div>

            </div>

        </>
    )

}

export default NavThoughMidiasByTimeRange