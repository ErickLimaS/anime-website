"use client"
import Link from 'next/link'
import React, { useLayoutEffect, useState } from 'react'
import styles from "./component.module.css"

function NavSideBar({ params }: { params?: { format: string } }) {

    const [currentParam, setCurrentParam] = useState("")

    useLayoutEffect(() => {
        setCurrentParam(params?.format || "")
    }, [params])

    return (
        <>
            <p>FORMAT</p>
            
            <nav id={styles.nav_container}>
                <ul>
                    <li data-active={currentParam == ""}>
                        <Link href={`/playlist`}>All</Link>
                    </li>
                    <li data-active={currentParam == "tv"}>
                        <Link href={`?format=tv`}>Animes</Link>
                    </li>
                    <li data-active={currentParam == "manga"}>
                        <Link href={`?format=manga`}>Mangas</Link>
                    </li>
                    <li data-active={currentParam == "movie"}>
                        <Link href={`?format=movie`}>Movies</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NavSideBar