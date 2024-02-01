"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo from '../MediaListCoverInfo'
import NavButtons from '../NavButtons'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import API from "@/api/anilist"

type PropsTypes = {

    data: void | ApiDefaultResult[],
    currentQueryValue?: string

}

function MediaRankingSection(props: PropsTypes) {

    const [mediaList, setMediaList] = useState<ApiDefaultResult[] | ApiDefaultResult | null>(null)

    let { data } = props
    let currentQueryValue = "ANIME"

    useEffect(() => {
        setMediaList(data as ApiDefaultResult[])
    }, [])

    // request new type of media then set them
    const loadMedia: (parameter: string) => void = async (parameter: string) => {

        const response = await API.getMediaForThisFormat(parameter).then(res => ((res as ApiDefaultResult[]).filter((item) => item.isAdult == false)))

        currentQueryValue = parameter

        setMediaList(response)
    }

    return (
        <div id={styles.rank_container}>

            <div className={styles.title_navbar_container}>

                <h3>Top 10 this week</h3>

                <NavButtons functionReceived={loadMedia as (parameter: string | number) => void} actualValue={currentQueryValue} options={[
                    { name: "Animes", value: "ANIME" }, { name: "Mangas", value: "MANGA" }
                ]} />

            </div>

            <ol>
                {((mediaList as ApiDefaultResult[]) || (data as ApiDefaultResult[])).slice(0, 10).map((item: ApiDefaultResult, key: number) => (
                    <MediaListCoverInfo key={key} positionIndex={key + 1} data={item} showCoverArt={false} />
                ))}
            </ol>

        </div>
    )

}

export default MediaRankingSection