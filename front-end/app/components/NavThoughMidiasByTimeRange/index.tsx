"use client"
import React, { useEffect, useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import { ApiAiringMidiaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import API from '@/api/anilist'
import MediaItemCoverInfo from '../MediaItemCoverInfo'
import ChevronLeftIcon from '../../../public/assets/chevron-left.svg'
import ChevronRightIcon from '../../../public/assets/chevron-right.svg'
import { convertToUnix } from '@/app/lib/format_date_unix'

function NavThoughMidiasByTimeRange() {

    // 1: 1 day (today), 7: 7 days (week), 30: 30 days (month)
    const [daysRange, setDaysRange] = useState<number>(1)
    const [data, setData] = useState<ApiAiringMidiaResults[]>([])

    const [pageIndex, setPageIndex] = useState<number>(1)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getMediaByDaysRange(1)
    }, [])

    // gets the range of days than parse it to unix, runs function to get any midia releasing in the selected range
    async function getMediaByDaysRange(days: number, newPageResults?: boolean, previous?: boolean) {

        setIsLoading(true)

        if (newPageResults == false) setPageIndex(1)

        const response = await API.getReleasingByDaysRange(
            "ANIME",
            convertToUnix(days),
            newPageResults ? (previous ? pageIndex - 1 : pageIndex + 1) : undefined
        ).then(
            res => (res as ApiAiringMidiaResults[]).filter((item) => item.media.isAdult == false)
        );

        if (newPageResults) setPageIndex(previous ? pageIndex - 1 : pageIndex + 1)

        setData(response)

        setDaysRange(days)

        setIsLoading(false)
    }

    return (
        <>
            <nav id={styles.nav_tabs_container} aria-label='Media By Range of Days Menu '>

                <ul className='display_flex_row'>
                    <li>
                        <button disabled={daysRange === 1} data-active={daysRange == 1} onClick={() => getMediaByDaysRange(1, false)}>Today</button>
                    </li>
                    <span>/</span>
                    <li>
                        <button disabled={daysRange === 7} data-active={daysRange == 7} onClick={() => getMediaByDaysRange(7, false)}>This week</button>
                    </li>
                    <span>/</span>
                    <li>
                        <button disabled={daysRange === 30} data-active={daysRange == 30} onClick={() => getMediaByDaysRange(30, false)}>Last 30 days</button>
                    </li>
                </ul>

            </nav>

            <div id={styles.itens_container}>

                {data.length > 0 ? (
                    (data as ApiAiringMidiaResults[]).slice(0, 8).map((item: ApiAiringMidiaResults, key: number) => (
                        <MediaItemCoverInfo
                            key={key}
                            data={item.media}
                            positionIndex={key + 1}
                            loading={isLoading} />
                    ))
                ) : (
                    <p className='display_align_justify_center'>
                        {daysRange == 1 && "Nothing Releasing Today"}
                        {daysRange == 7 && "Nothing Released in 7 Days"}
                        {daysRange == 30 && "Nothing Released in 30 Days"}
                    </p>
                )}

                <div id={styles.nav_title_buttons_container}>

                    <h3>Latest Releases</h3>

                    <div id={styles.buttons_container} className='display_flex_row display_align_justify_center'>
                        <button
                            onClick={() => getMediaByDaysRange((daysRange as number), true, true)}
                            disabled={pageIndex == 1}
                            aria-label="Previous Page Results"
                        >
                            <ChevronLeftIcon alt="Icon Facing Left" />
                        </button>
                        <button
                            onClick={() => getMediaByDaysRange((daysRange as number), true, false)}
                            disabled={data?.length <= 3}
                            aria-label="Next Page Results"
                        >
                            <ChevronRightIcon alt="Icon Facing Right" />
                        </button>
                    </div>

                    <Link href={`/releases/`} className='display_align_justify_center'>VIEW ALL <ChevronRightIcon alt="Icon Facing Right" /></Link>
                </div>

            </div>

        </>
    )

}

export default NavThoughMidiasByTimeRange