"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { AnimatePresence, motion } from "framer-motion"
import styles from "./component.module.css"
import FullScreenSvg from "@/public/assets/arrows-fullscreen.svg"
import CloseSvg from "@/public/assets/x.svg"

// file is in JAVASCRIPT for a REASON
// THIS Library doesnt support TypeScript. With That, i couldnt just add a value to every prop it has.
// making it a Js File was better than just having a bunch of undefined values :\
// https://www.npmjs.com/package/page-flip
function ChaptersPages({ data, initialPage }) {

    const [currPage, setCurrPage] = useState(initialPage || 0)
    const [showOnModal, setShowOnModal] = useState(false)

    const pagesComponentRef = useRef()

    function changeCurrPage(number) {
        setCurrPage(number)
        // pagesComponentRef.current.pageFlip().turnToPage(number)
    }

    useEffect(() => {

        setCurrPage(0)

        // if (pagesComponentRef.current != null) {
        //     console.log(pagesComponentRef)
        //     pagesComponentRef.current.pageFlip().turnToPage(initialPage)
        // }

    }, [data, initialPage])

    return (
        <section id={styles.container}>

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
                        onFlip={(e) => changeCurrPage(e.data)}
                    >

                        {data.map((item, key) => (
                            <div key={key}>
                                <Image src={item.img} alt={`Page ${item.page}`} fill sizes='550px' quality={100} />
                            </div>
                        ))}

                    </HTMLFlipBook>
                </motion.div>
            )}

            <motion.button id={styles.fullscreen_btn} onClick={() => setShowOnModal(true)} whileTap={{ scale: 0.9 }}>
                <FullScreenSvg width={16} height={16} /> Read on Fullscreen
            </motion.button>

            {/* FULLSCREEN MODAL */}
            <AnimatePresence>
                {(data && showOnModal) && (
                    <motion.div
                        id={styles.modal_chapter_pages_fullscreen_container}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3 } }}
                        exit={{ opacity: 0 }}
                    >

                        <div id={styles.close_btn_container}>

                            <span className={styles.page_indicator_text}>Page <b>{currPage + 1 >= data.length ? data.length : `${currPage + 1} -`} {currPage + 2 > data.length ? "" : currPage + 2}</b> out of <b>{data.length}</b></span>

                            <motion.button onClick={() => setShowOnModal(false)} whileTap={{ scale: 0.9 }} aria-label={showOnModal ? "Close" : "Open on Fullscreen"}>
                                <CloseSvg width={16} height={16} />
                            </motion.button>

                        </div>

                        <HTMLFlipBook
                            onClick={(e) => e.stopPropagation()}
                            ref={pagesComponentRef}
                            size='stretch'
                            autoSize
                            width={650}
                            height={1033}
                            minWidth={315}
                            maxWidth={1000}
                            minHeight={400}
                            maxHeight={1533}
                            startZIndex={initialPage || 0}
                            flippingTime={300}
                            onFlip={(e) => changeCurrPage(e.data)}
                        >

                            {data.map((item, key) => (
                                <div
                                    key={key}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Image src={item.img} alt={`Page ${item.page}`} fill sizes='550px' quality={100} />
                                </div>
                            ))}

                        </HTMLFlipBook>

                    </motion.div>
                )}

                {!data && (

                    <h2>Not Available</h2>

                )}

            </AnimatePresence>

            <span className={styles.page_indicator_text}>Page <b>{currPage + 1 >= data.length ? data.length : `${currPage + 1} -`} {currPage + 2 > data.length ? "" : currPage + 2}</b> out of <b>{data.length}</b></span>

            <p>Reading Direction is {`"Left to Right"`} Type</p>

            <p>Use the ZOOM of your device for a better experience</p>

        </section>
    )
}

export default ChaptersPages