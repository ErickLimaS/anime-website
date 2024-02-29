"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import SvgFilter from "@/public/assets/funnel.svg"
import SvgClose from "@/public/assets/x.svg"

function NavSideBar({ isMobile }: { isMobile: boolean }) {

    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [urlQuery, setUrlQuery] = useState(new URLSearchParams(Array.from(searchParams.entries())))

    const [isLoading, setLoading] = useState(false)
    const [openFiltersMenu, setOpenFiltersMenu] = useState(false)

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

    const range = (n: number) => [...Array(n).keys()]

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

    const allStatusAnilist = [
        { name: "Finished", value: "finished" },
        { name: "Releasing", value: "ongoing" },
        { name: "Not Yet Released", value: "upcoming" },
        { name: "Hiatus", value: "unknown" },
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

    return (
        <>
            {isMobile && (
                <button
                    id={styles.btn_filters}
                    onClick={() => setOpenFiltersMenu(!openFiltersMenu)}
                    data-active={openFiltersMenu}
                >
                    {openFiltersMenu ? (
                        <>
                            <SvgClose width={16} height={16} alt="Close" /> FILTERS
                        </>
                    ) : (
                        <>
                            <SvgFilter width={16} height={16} alt="Filter" /> FILTERS
                        </>
                    )}

                </button>
            )}

            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {((isMobile && openFiltersMenu == true) || (!isMobile && !openFiltersMenu)) && (
                    <motion.div
                        id={styles.backdrop}
                        onClick={() => setOpenFiltersMenu(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* SHOW IF IT IS MOBILE AND MENU IS OPEN, OR IF IS NOT MOBILE (ON DESKTOP) AND MENU IS CLOSED */}
                        {((isMobile && openFiltersMenu == true) || (!isMobile && !openFiltersMenu)) && (
                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                onScrollCapture={(e) => e.stopPropagation()}
                                id={styles.container}
                                variants={showUpMotion}
                                initial="hidden"
                                animate="visible"
                                data-loading={isLoading}
                                data-active={openFiltersMenu}
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
                                                        checked={urlQuery.get("genre")?.includes(item.value)}
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
                                        {range(70).map((item, key) => (
                                            <option
                                                selected={urlQuery.get("year")?.search(`/\b${new Date().getFullYear() - item}\b/`) == 1 ? true : false}
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

                                        <li>
                                            <label>Anime
                                                <input
                                                    type='checkbox'
                                                    value={"tv"}
                                                    checked={urlQuery.get("type") == "tv" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li>

                                        <li>
                                            <label>Manga
                                                <input
                                                    type='checkbox'
                                                    value={"manga"}
                                                    checked={urlQuery.get("type") == "manga" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>

                                                </input>
                                            </label>
                                        </li>

                                        <li>
                                            <label>Movie
                                                <input type='checkbox'
                                                    value={"movie"}
                                                    checked={urlQuery.get("type") == "movie" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>

                                                </input>
                                            </label>
                                        </li>

                                        <li>
                                            <label>Special
                                                <input
                                                    type='checkbox'
                                                    value={"special"}
                                                    checked={urlQuery.get("type") == "special" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li>

                                        <li>
                                            <label>Novel
                                                <input
                                                    type='checkbox'
                                                    value={"novel"}
                                                    checked={urlQuery.get("type") == "novel" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li>

                                        <li>
                                            <label>Ova
                                                <input
                                                    type='checkbox'
                                                    value={"ova"}
                                                    checked={urlQuery.get("type") == "ova" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li>

                                        <li>
                                            <label>Ona
                                                <input
                                                    type='checkbox'
                                                    value={"ona"}
                                                    checked={urlQuery.get("type") == "ona" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li >

                                        <li>
                                            <label>Music
                                                <input
                                                    type='checkbox'
                                                    value={"music"}
                                                    checked={urlQuery.get("type") == "music" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li >

                                        <li>
                                            <label>Tv Short
                                                <input
                                                    type='checkbox'
                                                    value={"tv_short"}
                                                    checked={urlQuery.get("type") == "tv_short" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li >

                                        <li>
                                            <label>One Shot
                                                <input
                                                    type='checkbox'
                                                    value={"one_shot"}
                                                    checked={urlQuery.get("type") == "one_shot" ? true : false}
                                                    onClick={(e) => fetchData("type", e.target)}>
                                                </input>
                                            </label>
                                        </li >

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
                                                        checked={urlQuery.get("status")?.includes(item.value)}
                                                        onClick={(e) => fetchData("status", e.target)}>
                                                    </input>
                                                </label>
                                            </li>
                                        ))}

                                    </ul>

                                </form>

                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default NavSideBar