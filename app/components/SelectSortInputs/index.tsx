"use client"
import React from 'react'
import SvgFilter from "@/public/assets/filter-right.svg"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from "./component.module.css"

function SelectSort({ options }: { options?: { name: string, value: string }[] }) {

    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function setOnUrlQuery(element: HTMLSelectElement) {

        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.set("sort", `${element.value}`)

        const query = current ? `?${current}` : ""

        router.push(`${pathname}${decodeURI(query)}`, { scroll: false })

    }

    return (
        <div id={styles.container} className='display_flex_row align_items_center'>
            <SvgFilter height={16} width={16} alt="Filter Icon" />
            <form>
                <select
                    title="Sort the results"
                    onChange={(e) => setOnUrlQuery(e.target)}
                    defaultValue={new URLSearchParams(Array.from(searchParams.entries())).get("sort") || "title_asc"}
                >
                    {options ? (
                        
                        options.map((item, key) => (
                            <option key={key} value={item.value}>
                                {item.name}
                            </option>
                        ))

                    ) : (
                        <>
                            <option value="title_asc">
                                From A to Z
                            </option>
                            <option value="title_desc" >
                                From Z to A
                            </option>
                            <option value="releases_desc">
                                Release Desc
                            </option>
                            <option value="releases_asc">
                                Release Asc
                            </option>
                        </>
                    )}
                </select>
            </form >
        </div >
    )
}

export default SelectSort