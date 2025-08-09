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

// This file is in JAVASCRIPT for a REASON
// This Library doesnt support TypeScript.
//
// https://www.npmjs.com/package/page-flip

export default function ChaptersPages({ chapters, initialPage }) {

  const [currPageNumber, setCurrPageNumber] = useState(initialPage || 0)
  const [showOnModal, setShowOnModal] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [format, setFormat] = useState("manga")

  const pagesComponentRef = useRef()

  useEffect(() => { setCurrPageNumber(0) }, [chapters, initialPage])

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "smooth" }) }, [])

  function handleChangeViewFormat() {

    setIsLoading(true)

    setFormat(format == "manga" ? "webtoon" : "manga")

    setTimeout(() => setIsLoading(false), 400)

  }

  function changeCurrPage(number) { setCurrPageNumber(number) }

  return (
    <section id={styles.container}>

      <PagesContainer
        ref={pagesComponentRef}
        format={format}
        isLoading={isLoading}
        chapters={chapters}
        initialPage={initialPage}
        changePageFunction={(e) => changeCurrPage(e.data)}
      />

      <div id={styles.btns_container}>

        <motion.button id={styles.change_format_btn} onClick={() => handleChangeViewFormat()} whileTap={{ scale: 0.9 }}>
          {format == "manga" ?
            <RectangleSvg width={16} height={16} style={{ scale: "1.4", transform: "rotate(90deg)" }} />
            :
            <MangaSvg width={16} height={16} />
          }
          {format == "manga" ? "Webtoon" : "Manga"} Mode {format == "manga" ? "(BETA)" : ""}
        </motion.button>

        <motion.button id={styles.fullscreen_btn} onClick={() => setShowOnModal(true)} whileTap={{ scale: 0.9 }}>
          <FullScreenSvg width={16} height={16} /> Read on Fullscreen
        </motion.button>

      </div>

      <FullScreenPagesView
        ref={pagesComponentRef}
        isLoading={isLoading}
        chapters={chapters}
        format={format}
        showOnModal={showOnModal}
        initialPage={initialPage}
        currPageNumber={currPageNumber}
        closeModalFunction={() => setShowOnModal(false)}
        changePageFunction={(e) => changeCurrPage(e.data)}
      />

      <span className={styles.page_indicator_text}>
        Page <b>{currPageNumber + 1 >= chapters.length ? chapters.length : `${currPageNumber + 1}`}</b> <b className={styles.text_only_desktop}>{currPageNumber + 2 > chapters.length ? "" : ` - ${currPageNumber + 2}`}</b> out of <b>{chapters.length}</b>
      </span>

    </section>
  )
}

function PagesContainer({ isLoading, chapters, format, initialPage, changePageFunction, ref }) {

  return (

    <AnimatePresence>
      {(!isLoading && chapters) && (
        <motion.div
          id={styles.pages_container}
          data-format={format}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: .4 } }}
          exit={{ opacity: 0, height: 0 }}
        >

          <HTMLFlipBook
            ref={ref}
            size='stretch'
            autoSize
            width={750}
            height={format == "manga" ? 933 : 2000}
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            startZIndex={initialPage || 0}
            flippingTime={300}
            onFlip={changePageFunction}
          >

            {chapters.map((page, key) => (
              <div key={key}>
                <Image
                  src={page.img}
                  alt={`Page ${page.page}`}
                  fill
                  sizes='550px'
                  quality={100}
                />
              </div>
            ))}

          </HTMLFlipBook>

        </motion.div>
      )}

    </AnimatePresence>

  )

}

function FullScreenPagesView({ isLoading, chapters, format, showOnModal, currPageNumber, initialPage, closeModalFunction, changePageFunction, ref }) {

  return (
    <AnimatePresence>
      {(!isLoading && chapters && showOnModal) && (
        <motion.div
          id={styles.modal_chapter_pages_fullscreen_container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0 }}
        >

          <div id={styles.close_btn_container}>

            <span className={styles.page_indicator_text}>
              Page <b>{currPageNumber + 1 >= chapters.length ? chapters.length : `${currPageNumber + 1}`}</b> <b className={styles.text_only_desktop}>{currPageNumber + 2 > chapters.length ? "" : ` - ${currPageNumber + 2}`}</b> out of <b>{chapters.length}</b>
            </span>

            <motion.button onClick={closeModalFunction} whileTap={{ scale: 0.9 }} aria-label={showOnModal ? "Close" : "Open on Fullscreen"}>
              <CloseSvg width={16} height={16} />
            </motion.button>

          </div>

          <HTMLFlipBook
            onClick={(e) => e.stopPropagation()}
            ref={ref}
            size='stretch'
            autoSize
            width={format == "manga" ? 850 : 31000}
            height={format == "manga" ? 1033 : 202000}
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            startZIndex={initialPage || 0}
            flippingTime={300}
            onFlip={changePageFunction}
          >

            {chapters.map((chapter, key) => (
              <div
                key={key}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={chapter.img}
                  alt={`Page ${chapter.page}`}
                  fill
                  sizes='550px'
                  quality={100}
                />
              </div>
            ))}

          </HTMLFlipBook>

        </motion.div>
      )}

      {!chapters && (

        <h2>Not Available</h2>

      )}

    </AnimatePresence>
  )

}