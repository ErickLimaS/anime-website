"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import aniwatch from '@/api/aniwatch'
import { EpisodeLinksAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import gogoanime from '@/api/gogoanime'
import { EpisodeLinksGoGoAnime } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import CloudOfflineSvg from "@/public/assets/cloud-offline.svg"
import CloudOnlineSvg from "@/public/assets/cloud.svg"

type PropsType = {
    functionReceived: (parameter: string | number) => void,
    options: OptionsType[],
    actualValue?: string | number,
    sepateWithSpan?: boolean,
    showSourceStatus?: boolean
}

type OptionsType = {
    name: string,
    value: number | string
}

function NavButtons(props: PropsType) {

    const { functionReceived } = props

    const [lastValueReceived, setLastValueReceived] = useState<string | number>()

    const [gogoanimeAvailble, setGogoanimeAvailble] = useState<boolean | null>()
    const [aniwatchAvailable, setAniwatchAvailable] = useState<boolean | null>()

    useEffect(() => {
        setLastValueReceived(props.actualValue || "" || 1)
    }, [props.actualValue])

    function toggleStateAndReturnValue(value: string | number) {

        // if user tries to make the same call, it just wont continue to do requests
        if (lastValueReceived == value) return

        // run the received function
        functionReceived(value)

        // set the actual value
        setLastValueReceived(value)

    }

    // checks if source is currently available 
    async function checkVideoSourceAvailable(sources: OptionsType[]) {

        sources.map(async (item) => {

            switch (item.value as string) {

                case 'gogoanime':

                    const gogoanimeResponse = await gogoanime.getLinksForThisEpisode("one-piece-episode-1") as EpisodeLinksGoGoAnime

                    setGogoanimeAvailble(gogoanimeResponse != null ? true : false)

                    break

                case 'aniwatch':

                    const aniwatchResponse = await aniwatch.episodesLinks("one-piece-100?ep=2142") as EpisodeLinksAnimeWatch

                    setAniwatchAvailable(aniwatchResponse != null ? true : false)

                    break

                default:

                    break

            }

        })

    }

    useEffect(() => {
        if (props.options) {
            checkVideoSourceAvailable(props.options)
        }
    }, [props?.options])

    return (
        <div className={styles.nav_button_container}>

            {props.options.map((item) => (
                <React.Fragment key={item.value}>
                    <button
                        className={props.showSourceStatus ? styles.white_color : ""}
                        data-active={lastValueReceived == (item.value)}
                        onClick={() => toggleStateAndReturnValue(item.value)}
                        aria-label={item.name}
                        title={
                            item.value != "crunchyroll" ?
                                item.value == "aniwatch" ?
                                    aniwatchAvailable ? "Online" : "Offline"
                                    :
                                    gogoanimeAvailble ? "Online" : "Offline"
                                :
                                ""
                        }
                    >

                        {(props.showSourceStatus && item.value != "crunchyroll") && (

                            item.value == "aniwatch" ?
                                aniwatchAvailable ?
                                    <CloudOnlineSvg
                                        width={18}
                                        height={18}
                                        className={styles.source_status}
                                        data-available={aniwatchAvailable}
                                    />
                                    :
                                    <CloudOfflineSvg
                                        width={24}
                                        height={24}
                                        className={styles.source_status}
                                        data-available={aniwatchAvailable}
                                    />
                                :
                                gogoanimeAvailble ?
                                    <CloudOnlineSvg
                                        width={18}
                                        height={18}
                                        className={styles.source_status}
                                        data-available={gogoanimeAvailble}
                                    />
                                    :
                                    <CloudOfflineSvg
                                        width={24}
                                        height={24}
                                        className={styles.source_status}
                                        data-available={gogoanimeAvailble}
                                    />

                        )}

                        {item.name}

                    </button >
                    {props.sepateWithSpan && (
                        <span className={styles.separate_text}> | </span>
                    )}
                </React.Fragment>
            ))}

        </div>
    )

}

export default NavButtons