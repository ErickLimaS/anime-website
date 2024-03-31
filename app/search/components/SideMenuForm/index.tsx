"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import simulateRange from '@/app/lib/simulateRange'
import styles from "./component.module.css"

function SideMenuForm({ onClick, currValue, mobileVersion }: { onClick: any, currValue: boolean, mobileVersion: boolean }) {

    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [urlQuery, setUrlQuery] = useState(new URLSearchParams(Array.from(searchParams.entries())))

    const [isLoading, setLoading] = useState(false)

    const allGenresAnilist = [
        { name: "Action", value: "action" },
        { name: "Comedy", value: "comedy" },
        { name: "Drama", value: "drama" },
        { name: "Ecchi", value: "ecchi" },
        { name: "Fantasy", value: "fantasy" },
        { name: "Horror", value: "horror" },
        { name: "Mahou", value: "mahou" },
        { name: "Shoujo", value: "shoujo" },
        { name: "Mecha", value: "mecha" },
        { name: "Mystery", value: "mystery" },
        { name: "Music", value: "music" },
        { name: "Psychological", value: "psychological" },
        { name: "Romance", value: "romance" },
        { name: "Slice of Life", value: "slice-of-Life" },
        { name: "Sci-fi", value: "sci-fi" },
        { name: "Sports", value: "sports" },
        { name: "Supernatural", value: "supernatural" },
        { name: "Thriller", value: "thriller" }
    ]

    const allTypesAnilist = [
        { name: "Anime", value: "tv" },
        { name: "Mangas", value: "manga" },
        { name: "Movie", value: "movie" },
        { name: "Novel", value: "novel" },
        { name: "Special", value: "special" },
        { name: "Ova", value: "ova" },
        { name: "Ona", value: "ona" },
        { name: "Music", value: "music" },
        { name: "Tv Short", value: "tv_short" },
        { name: "One Shot", value: "one_shot" },
    ]

    const allStatusAnilist = [
        { name: "Finished", value: "finished" },
        { name: "Releasing", value: "ongoing" },
        { name: "To be Released", value: "upcoming" },
        { name: "Hiatus", value: "unknown" },
    ]

    const allSeasonsAnilist = [
        { name: "Summer", value: "summer" },
        { name: "Winter", value: "winter" },
        { name: "Fall", value: "fall" },
        { name: "Spring", value: "spring" }
    ]

    function fetchData(queryType: string, inputTarget: any) {

        const current = new URLSearchParams(Array.from(searchParams.entries()));

        setLoading(true)

        if (queryType == "genre") {

            if (current.get("genre")?.includes(inputTarget.value)) {

                const originalString = current.get("genre")

                if (originalString == `[${inputTarget.value}]`) {

                    current.delete("genre")

                    setUrlQuery(current)

                    const query = `?${current}`

                    router.push(`${pathname}${decodeURI(query)}`)

                    setLoading(false)
                    return
                }

                const newString = originalString!.replace(`-${inputTarget.value}`, "")

                current.set("genre", newString)
                const query = `?${current}`

                setUrlQuery(current)

                router.push(`${pathname}${decodeURI(query)}`)

                setLoading(false)

                return
            }

            current.set(queryType, current.get("genre") ?
                `[${current.get("genre")?.slice(1, current.get("genre")!.length - 1)}-${inputTarget.value}]`
                :
                `[${inputTarget.value}]`
            )

        }
        else {
            if (queryType == "year" && inputTarget.value == "any") {

                current.delete("year")

                const query = `?${current}`

                setUrlQuery(current)

                router.push(`${pathname}${decodeURI(query)}`)

                setLoading(false)

                return

            }

            if (current.get(queryType)?.includes(inputTarget.value)) {
                current.delete(queryType)
            }
            else {
                current.set(queryType, inputTarget.value)
            }
        }

        const query = current ? `?${current}` : ""

        router.push(`${pathname}${decodeURI(query)}`)

        setUrlQuery(current)

        setLoading(false)

    }

    const showUpMotion = {

        hidden: {
            opacity: 0,
            scale: 1.08
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3
            }
        }

    }

    return (
        <motion.div
            id={styles.backdrop}
            data-mobile-version={mobileVersion}
            onClick={() => onClick(!currValue)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* SHOW IF IT IS MOBILE AND MENU IS OPEN, OR IF IS NOT MOBILE (ON DESKTOP) AND MENU IS CLOSED */}

            <motion.div
                onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
                onScrollCapture={(e: { stopPropagation: () => any }) => e.stopPropagation()}
                id={styles.container}
                variants={showUpMotion}
                initial="hidden"
                animate="visible"
                data-loading={isLoading}
                data-active={currValue}
            >
                <form className={styles.nav_container}>

                    <p>GENRES</p>

                    <ul>

                        {allGenresAnilist.map((item, key) => (
                            <li key={key}>
                                <label>
                                    {item.name}
                                    <input
                                        type='checkbox'
                                        value={item.value}
                                        defaultChecked={urlQuery.get("genre")?.includes(item.value)}
                                        onClick={(e) => fetchData("genre", e.target)}>
                                    </input>
                                </label>
                            </li>
                        ))}

                    </ul>

                </form>

                <form className={styles.nav_container}>

                    <p>YEAR</p>

                    <select
                        defaultValue={urlQuery.get("year") ? `${urlQuery.get("year")}` : `any`}
                        onChange={(e) => fetchData("year", e.target)}
                    >
                        <option value="any">Any</option>
                        {simulateRange(60).map((item, key) => (
                            <option
                                key={key}
                                value={new Date().getFullYear() - item}
                            >
                                {new Date().getFullYear() - item}
                            </option>
                        ))}
                    </select>

                </form>

                <form className={`${styles.nav_container} ${styles.hidden_checkbox}`}>

                    <p>TYPE</p>

                    <ul>
                        {allTypesAnilist.map((item, key) => (
                            <li key={key}>
                                <label>
                                    {item.name}
                                    <input
                                        type='checkbox'
                                        value={item.value}
                                        defaultChecked={urlQuery.get("type")?.includes(item.value)}
                                        onClick={(e) => fetchData("type", e.target)}>
                                    </input>
                                </label>
                            </li>
                        ))}
                    </ul>

                </form>

                <form className={`${styles.nav_container} ${styles.hidden_checkbox} ${styles.hidden_checkbox2}`}>

                    <p>STATUS</p>

                    <ul>

                        {allStatusAnilist.map((item, key) => (
                            <li key={key}>
                                <label>
                                    {item.name}
                                    <input
                                        type='checkbox'
                                        value={item.value}
                                        defaultChecked={urlQuery.get("status")?.includes(item.value)}
                                        onClick={(e) => fetchData("status", e.target)}>
                                    </input>
                                </label>
                            </li>
                        ))}

                    </ul>

                </form>

                <form className={`${styles.nav_container} ${styles.hidden_checkbox} ${styles.hidden_checkbox2}`}>

                    <p>SEASON</p>

                    <ul>

                        {allSeasonsAnilist.map((item, key) => (
                            <li key={key}>
                                <label>
                                    {item.name}
                                    <input
                                        type='checkbox'
                                        value={item.value}
                                        defaultChecked={urlQuery.get("season")?.includes(item.value)}
                                        onClick={(e) => fetchData("season", e.target)}>
                                    </input>
                                </label>
                            </li>
                        ))}

                    </ul>

                </form>

            </motion.div>

        </motion.div>
    )
}

export default SideMenuForm