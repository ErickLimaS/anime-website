"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo2 from '../../MediaCards/MediaCover2'
import CoverWithMediaInfo from '../../MediaCards/CoverWithMediaInfo'
import NavButtons from '../../NavButtons'
import { ApiAiringMidiaResults, ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from "@/app/api/anilist"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { getUserAdultContentPreference } from '@/app/lib/firebaseUserActions/userDocFetchOptions'

type ComponentTypes = {

    initialAnimesList: ApiDefaultResult[]

}

export const revalidate = 1800 // revalidate the data every 30 min

function NewestMediaSection({ initialAnimesList }: ComponentTypes) {

    const [animesList, setAnimesList] = useState<ApiAiringMidiaResults[] | ApiDefaultResult[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [currDaysValue] = useState<number>(1)

    const [isAdultContentSetToShow, setIsAdultContentSetToShow] = useState<boolean | null>(null)

    const auth = getAuth()
    const [user] = useAuthState(auth)

    useEffect(() => {

        if (!initialAnimesList[0]) {

            fetchMediaByDaysRange(30)

            return

        }

        setAnimesList(initialAnimesList)
        setIsLoading(false)

    }, [currDaysValue])

    async function getUserPreference() {

        if (!user) return false

        if (isAdultContentSetToShow) return isAdultContentSetToShow

        const userAdultContentPreference: boolean = await getUserAdultContentPreference(user)

        setIsAdultContentSetToShow(userAdultContentPreference)

        return userAdultContentPreference

    }

    const handleParameterToFetchNewData: (parameter: 1 | 7 | 30) => void = async (parameter: 1 | 7 | 30) => {

        fetchMediaByDaysRange(parameter)

    }

    async function fetchMediaByDaysRange(days: 1 | 7 | 30) {

        setIsLoading(true)

        const isAdultContentAllowed = await getUserPreference()

        const listAnimesByDaysRange = await anilist.getReleasingByDaysRange("ANIME", days, undefined, 11, isAdultContentAllowed).then(
            res => ((res as ApiAiringMidiaResults[]).sort((a, b) => a.media.popularity - b.media.popularity).reverse())
        ).then(res => res.map((item) => item.media))

        setAnimesList(listAnimesByDaysRange)

        setIsLoading(false)

    }

    return (
        <div id={styles.newest_conteiner}>

            <div className={styles.title_navbar_container}>

                <h3>Newest Animes Episodes</h3>

                <NavButtons
                    functionReceived={handleParameterToFetchNewData as (parameter: string | number) => void}
                    actualValue={initialAnimesList[0] == null || initialAnimesList[0] == undefined ? 30 : currDaysValue}
                    options={[
                        { name: "Today", value: 1 }, { name: "This week", value: 7 }, { name: "Last 30 days", value: 30 }
                    ]} />

            </div>

            <ul>
                {!isLoading && (
                    <>
                        <li>
                            {(animesList[0] != undefined) ? (
                                <CoverWithMediaInfo data={(animesList as ApiDefaultResult[])[0]} />
                            ) : (
                                <p>No results for today</p>
                            )}
                        </li>

                        {(animesList as ApiDefaultResult[]).slice(1, 11).map((item, key: number) => (
                            <MediaListCoverInfo2 key={key} positionIndex={key + 1} data={item} showCoverArt={true} alternativeBorder={true} />
                        ))}
                    </>
                )}
            </ul>

        </div>
    )
}

export default NewestMediaSection