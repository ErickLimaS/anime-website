"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { AnimatePresence, motion } from "framer-motion"
import styles from "./component.module.css"

// file is in JAVASCRIPT for a REASON
// THIS Library doesnt support TypeScript. With That, i couldnt just add a value to every prop it has.
// making it a Js File was better than just having a bunch of undefined values :\
// https://www.npmjs.com/package/page-flip
function ChaptersPages({ data, initialPage }) {

    const [currPage, setCurrPage] = useState(initialPage || 0)

    const pagesComponentRef = useRef()

    useEffect(() => {

        setCurrPage(0)

        // if (pagesComponentRef.current != null) {
        //     console.log(pagesComponentRef)
        //     pagesComponentRef.current.pageFlip().turnToPage(initialPage)
        // }

    }, [data, initialPage])

    return (
        <section id={styles.container}>

            <AnimatePresence>

                {data && (
                    <motion.div id={styles.pages_container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <HTMLFlipBook
                            ref={pagesComponentRef}
                            size='stretch'
                            autoSize
                            width={550}
                            height={933}
                            minWidth={315}
                            maxWidth={1000}
                            minHeight={400}
                            maxHeight={1533}
                            startZIndex={initialPage || 0}
                            flippingTime={300}
                            onFlip={(e) => setCurrPage(e.data)}
                        >

                            {data.map((item, key) => (
                                <div key={key}>
                                    <Image src={item.img} alt={`Page ${item.page}`} fill sizes='500px' quality={100} />
                                </div>
                            ))}

                        </HTMLFlipBook>
                    </motion.div>
                )}

                {!data && (

                    <h2>Not Available</h2>

                )}

            </AnimatePresence>

            <span>Page <b>{currPage + 1 >= data.length ? data.length : `${currPage + 1} -`} {currPage + 2 > data.length ? "" : currPage + 2}</b> out of <b>{data.length}</b></span>

            <p>Use the Zoom of your device for a better experience</p>

        </section>
    )
}

export default ChaptersPages