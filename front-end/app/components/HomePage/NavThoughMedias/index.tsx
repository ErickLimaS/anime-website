"use client"
import React, { useEffect, useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import { ApiAiringMidiaResults, ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import API from '@/api/anilist'
import MediaItemCoverInfo from '../../MediaItemCoverInfo'
import ChevronLeftIcon from '@/public/assets/chevron-left.svg'
import ChevronRightIcon from '@/public/assets/chevron-right.svg'
import { convertToUnix } from '@/app/lib/format_date_unix'
import { Url } from 'next/dist/shared/lib/router/router'

type Component = {

    title: string,
    route: Url,
    sort: string,
    dateOptions?: boolean,
    darkBackground?: boolean,
    layoutInverted?: boolean,

}

function NavThoughMedias({ title, route, dateOptions, sort, darkBackground, layoutInverted }: Component) {

    // IF SORT = RELEASE --> 1: 1 day (today), 7: 7 days (week), 30: 30 days (month)
    const [daysRange, setDaysRange] = useState<number>(1)

    const [data, setData] = useState<ApiAiringMidiaResults[] | ApiDefaultResult[]>([])

    const [pageIndex, setPageIndex] = useState<number>(1)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function getMedias(newPageResults?: boolean, days?: number, previous?: boolean) {

        setIsLoading(true)

        if (newPageResults == false) setPageIndex(1)

        let response

        
        if (sort == "RELEASE") {

            // gets the range of days than parse it to unix and get any media releasing in the selected range
            response = await API.getReleasingByDaysRange(
                "ANIME",
                convertToUnix(days!),
                newPageResults ? (previous ? pageIndex - 1 : pageIndex + 1) : undefined
            ).then(
                res => (res as ApiAiringMidiaResults[]).filter((item) => item.media.isAdult == false)
            )

            setDaysRange(days!)

        }
        else {

            response = await API.getMediaForThisFormat(
                "ANIME",
                sort,
                newPageResults ? (previous ? pageIndex - 1 : pageIndex + 1) : undefined,
                5
            ).then(
                res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
            )
            
        }

        // handles the pagination
        if (newPageResults) setPageIndex(previous ? pageIndex - 1 : pageIndex + 1)

        setData(response)

        setIsLoading(false)
    }

    useEffect(() => {

        if (sort == "RELEASE") {
            if (data[0] == null || data[0] == undefined) {
                getMedias(undefined, 30)
            } else {
                getMedias(undefined, 1)
            }
        }
        else {
            getMedias()
        }

    }, [])

    return (
        <>

            {dateOptions && (
                <nav id={styles.nav_tabs_container} aria-label='Media By Range of Days Menu '>

                    <ul className='display_flex_row'>
                        <li>
                            <button disabled={daysRange === 1} data-active={daysRange == 1} onClick={() => getMedias(undefined, 1, false)}>Today</button>
                        </li>
                        <span>/</span>
                        <li>
                            <button disabled={daysRange === 7} data-active={daysRange == 7} onClick={() => getMedias(undefined, 7, false)}>This week</button>
                        </li>
                        <span>/</span>
                        <li>
                            <button disabled={daysRange === 30} data-active={daysRange == 30} onClick={() => getMedias(undefined, 30, false)}>Last 30 days</button>
                        </li>
                    </ul>

                </nav>
            )}

            <div
                id={styles.itens_container}
                data-darkBackground={darkBackground && darkBackground}
                data-layoutInverted={layoutInverted && layoutInverted}
            >

                {data.length > 0 ? (
                    data.slice(0, 8).map((item, key: number) => (
                        <MediaItemCoverInfo
                            key={key}
                            data={sort == "RELEASE" ? (item as ApiAiringMidiaResults).media : (item as ApiDefaultResult)}
                            positionIndex={key + 1}
                            loading={isLoading}
                            darkMode={darkBackground}
                        />
                    ))
                ) : (
                    <p className='display_align_justify_center'>
                        {!dateOptions && "No results"}
                        {(dateOptions && daysRange == 1) && "Nothing Releasing Today"}
                        {(dateOptions && daysRange == 7) && "Nothing Released in 7 Days"}
                        {(dateOptions && daysRange == 30) && "Nothing Released in 30 Days"}
                    </p>
                )}

                <div id={styles.nav_title_buttons_container}>

                    <h3>{title}</h3>

                    <div id={styles.buttons_container} className='display_flex_row display_align_justify_center'>

                        <button
                            onClick={() => sort == "RELEASE" ? getMedias(true, (daysRange as number), true) : getMedias(true, undefined, true)}
                            disabled={pageIndex == 1}
                            aria-label="Previous Page Results"
                        >
                            <ChevronLeftIcon alt="Icon Facing Left" />
                        </button>

                        <button
                            onClick={() => sort == "RELEASE" ? getMedias(true, (daysRange as number), false) : getMedias(true, undefined, false)}
                            disabled={data?.length <= 3}
                            aria-label="Next Page Results"
                        >
                            <ChevronRightIcon alt="Icon Facing Right" />
                        </button>

                    </div>

                    <span id={styles.line}></span>

                    <Link href={route} className='display_align_justify_center'>VIEW ALL <ChevronRightIcon alt="Icon Facing Right" /></Link>
                </div>

            </div>

        </>
    )

}

export default NavThoughMedias