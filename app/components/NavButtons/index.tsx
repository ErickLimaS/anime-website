"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import aniwatch from '@/app/api/aniwatch'
import { EpisodeLinksAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import gogoanime from '@/app/api/consumetGoGoAnime'
import { EpisodeLinksGoGoAnime } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import CloudOfflineSvg from "@/public/assets/cloud-offline.svg"
import CloudOnlineSvg from "@/public/assets/cloud.svg"

type PropsType = {
    propsFunction: (parameter: string | number) => void,
    buttonOptions: {
        name: string,
        value: number | string
    }[],
    currValue?: string | number,
    sepateBtnsWithSpan?: boolean,
    showSourceStatus?: boolean
}

function NavigationButtons({ propsFunction, buttonOptions, currValue, sepateBtnsWithSpan, showSourceStatus }: PropsType) {

    const [lastValueReturned, setLastValueReturned] = useState<string | number>()

    const [gogoanimeAvailble, setGogoanimeAvailble] = useState<boolean | null>()
    const [aniwatchAvailable, setAniwatchAvailable] = useState<boolean | null>()

    useEffect(() => setLastValueReturned(currValue || "" || 1), [currValue])

    useEffect(() => { if (buttonOptions) checkVideoSourceAvailability(buttonOptions) }, [buttonOptions])

    function handlePropsFunctionWithBtnValue(value: string | number) {

        if (lastValueReturned == value) return

        // run the received function
        propsFunction(value)

        // set the actual value
        setLastValueReturned(value)

    }

    // checks if source is currently available 
    async function checkVideoSourceAvailability(videoSourcesAvailable: PropsType["buttonOptions"]) {

        videoSourcesAvailable.map(async (source) => {

            switch (source.value) {

                case 'gogoanime':

                    const gogoanimeResponse = await gogoanime.getEpisodeStreamingLinks2("one-piece-episode-1") as EpisodeLinksGoGoAnime

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

    function getBtnTitleByBtnValue(btnValue: string) {

        const btnTitle = btnValue != "crunchyroll" ?
            btnValue == "aniwatch" ?
                aniwatchAvailable ? "Online" : "Offline"
                :
                gogoanimeAvailble ? "Online" : "Offline"
            :
            ""

        return btnTitle

    }

    return (
        <div className={styles.nav_button_container}>

            {buttonOptions.map((button) => (
                <React.Fragment key={button.value}>
                    <button
                        className={showSourceStatus ? styles.white_color : ""}
                        data-active={lastValueReturned == (button.value)}
                        onClick={() => handlePropsFunctionWithBtnValue(button.value)}
                        aria-label={button.name}
                        title={getBtnTitleByBtnValue(button.value as string)}
                    >

                        {(showSourceStatus && button.value != "crunchyroll") && (

                            button.value == "aniwatch" ?
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

                        {button.name}

                    </button >
                    {sepateBtnsWithSpan && (
                        <span className={styles.separate_text}> | </span>
                    )}
                </React.Fragment>
            ))}

        </div>
    )

}

export default NavigationButtons