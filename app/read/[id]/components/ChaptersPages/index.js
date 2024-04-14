"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { AnimatePresence, motion } from "framer-motion"
import styles from "./component.module.css"
import FullScreenSvg from "@/public/assets/arrows-fullscreen.svg"
import CloseSvg from "@/public/assets/x.svg"
import MangaSvg from "@/public/assets/book.svg"
import RectangleSvg from "@/public/assets/rectangle.svg"


// file is in JAVASCRIPT for a REASON
// THIS Library doesnt support TypeScript. With That, i couldnt just add a value to every prop it has.
// making it a Js File was better than just having a bunch of undefined values :\
// https://www.npmjs.com/package/page-flip
function ChaptersPages({ data, initialPage }) {

    const [currPage, setCurrPage] = useState(initialPage || 0)
    const [showOnModal, setShowOnModal] = useState(false)

    const [loading, setLoading] = useState(false)

    const [format, setFormat] = useState("manga")

    const pagesComponentRef = useRef()

    function changeViewFormat() {

        setLoading(true)

        setFormat(format == "manga" ? "webtoon" : "manga")

        setTimeout(() => setLoading(false), 400)

    }

    function changeCurrPage(number) {
        setCurrPage(number)
    }

    useEffect(() => {

        setCurrPage(0)

    }, [data, initialPage])

    return (
        <section id={styles.container}>

            <AnimatePresence>

                {(!loading && data) && (
                    <motion.div id={styles.pages_container} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: .4 } }} exit={{ opacity: 0, height: 0 }}>

                        <HTMLFlipBook
                            ref={pagesComponentRef}
                            size='stretch'
                            autoSize
                            width={550}
                            height={format == "manga" ? 933 : 2000}
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

            </AnimatePresence>

            <div id={styles.btns_container}>

                <motion.button id={styles.change_format_btn} onClick={() => changeViewFormat()} whileTap={{ scale: 0.9 }}>
                    {format == "manga" ?
                        <RectangleSvg width={16} height={16} style={{ scale: "1.4", transform: "rotate(90deg)" }} />
                        :
                        <MangaSvg width={16} height={16} />
                    }
                    {format == "manga" ? "Webtoon" : "Manga"} Mode
                </motion.button>

                <motion.button id={styles.fullscreen_btn} onClick={() => setShowOnModal(true)} whileTap={{ scale: 0.9 }}>
                    <FullScreenSvg width={16} height={16} /> Read on Fullscreen
                </motion.button>

            </div>

            {/* FULLSCREEN MODAL */}
            <AnimatePresence>
                {(!loading && data && showOnModal) && (
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
                            height={format == "manga" ? 1033 : 2000}
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

            <p>Reading Direction: Left to Right</p>

        </section>
    )
}

export default ChaptersPages