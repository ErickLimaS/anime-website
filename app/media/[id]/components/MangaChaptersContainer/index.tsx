"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css";
import Link from 'next/link';
import { MangaChapters, MangaInfo } from '@/app/ts/interfaces/apiMangadexDataInterface';
import BookSvg from "@/public/assets/book.svg"
import NavPaginateItems from '@/app/media/[id]/components/PaginateItems';
import Image from 'next/image';
import ErrorImg from "@/public/error-img-2.png"
import manga from '@/app/api/consumetManga';
import { AnimatePresence, motion } from 'framer-motion';
import simulateRange from '@/app/lib/simulateRange';
import MarkChapterAsReadButton from '@/app/components/Buttons/MarkChapterAsRead';
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import { getClosestMangaResultByTitle } from '@/app/lib/fetchMangaOptions';
import { stringToUrlFriendly } from '@/app/lib/convertStringsTo';

const framerMotionLoadingChapters = {
  initial: {
    opacity: 0,
    scale: 0
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0
  }
}

function MangaChaptersContainer({ mediaInfo }: { mediaInfo: ApiMediaResults }) {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [chapterList, setChaptersList] = useState<MangaChapters[]>([])

  const [currItems, setCurrItems] = useState<MangaChapters[] | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)

  const [itemOffset, setItemOffset] = useState<number>(0)

  const rangeChaptersPerPage = 10

  useEffect(() => {

    if (chapterList.length == 0) fetchMangaChapters()

    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrItems(chapterList.slice(itemOffset, endOffset));

  }, [itemOffset, rangeChaptersPerPage])


  function handleButtonPageNavigation(event: { selected: number }) {

    setIsLoading(true) // Needed to refresh chapters component "Mark Chapters Read"

    const newOffset = event.selected * rangeChaptersPerPage % chapterList.length

    setItemOffset(newOffset)

    setTimeout(() => setIsLoading(false), 500)  // Needed to refresh chapters component "Mark Chapters Read"

  }

  async function fetchMangaChapters() {

    setIsLoading(true)

    const query = stringToUrlFriendly(mediaInfo.title.romaji).toLowerCase()

    let mangaInfo: MangaInfo

    mangaInfo = await manga.getInfoFromThisMedia({ id: query }) as MangaInfo

    if (!mangaInfo) {

      const mangaClosestResult = await getClosestMangaResultByTitle(query, mediaInfo)

      mangaInfo = await manga.getInfoFromThisMedia({ id: mangaClosestResult as string }) as MangaInfo

      if (!mangaInfo) {

        setIsLoading(false)

        setCurrItems(null)

        return

      }

    }

    setChaptersList(mangaInfo.chapters.filter(item => item.pages != 0))

    const endOffset = itemOffset + rangeChaptersPerPage

    setCurrItems(mangaInfo.chapters.filter(item => item.pages != 0).slice(itemOffset, endOffset))

    setPageCount(Math.ceil(mangaInfo.chapters.filter(item => item.pages != 0).length / rangeChaptersPerPage))

    setIsLoading(false)

  }

  return (
    <div>

      <AnimatePresence>
        <motion.ol
          id={styles.container}
          data-loading={isLoading}
          variants={framerMotionLoadingChapters}
          initial="initial"
          animate="animate"
          exit="exit"
        >

          {/* LOADING */}
          {isLoading && (
            <motion.div
              id={styles.loading_chapters_container}
              variants={framerMotionLoadingChapters}
              initial="initial"
              animate="animate"
              exit="exit"
            >

              {simulateRange(10).map((item, key) => (

                <motion.div
                  key={key}
                  variants={framerMotionLoadingChapters}
                />

              ))}

            </motion.div>
          )}

          {/* SHOWS WHEN THERES NO RESULTS  */}
          {!isLoading && (chapterList.length == 0 || currItems == null) && (
            <div id={styles.no_chapters_container}>

              <Image src={ErrorImg} alt='Error' height={200} />

              <p>No chapters available.</p>

            </div>
          )}

          {(currItems && !isLoading) && currItems.map((item, key: number) => (
            <motion.li
              key={key}
              title={`Chapter ${item.chapterNumber} - ${mediaInfo.title.romaji}`}
              data-disabled={item.pages == 0}
              variants={framerMotionLoadingChapters}
              className={styles.chapter_container}
            >

              <div className={styles.icon_container}>
                <BookSvg alt="Book Opened Icon" width={16} heighy={16} />
              </div>

              <Link href={`/read/${mediaInfo.id}?source=mangadex&chapter=${item.chapterNumber}&q=${item.id}`}>
                <div className={styles.info_container}>

                  <h3>{item.title != item.chapterNumber ? `Chapter ${item.chapterNumber}: ${item.title}` : `Chapter ${item.chapterNumber}` || "Not Available"}</h3>

                  <p>{item.pages == 0 ? "No Pages Found!" : `${item.pages} Pages`}</p>

                </div>

              </Link>

              <MarkChapterAsReadButton
                chapterNumber={Number(item.chapterNumber)}
                chapterTitle={item.title}
                mediaId={mediaInfo.id}
                hasText
              />

            </motion.li>
          ))}

        </motion.ol>
      </AnimatePresence>

      {chapterList.length > 0 && (
        <nav id={styles.pagination_buttons_container}>

          <NavPaginateItems
            onPageChange={handleButtonPageNavigation}
            pageCount={pageCount}
          />

        </nav>
      )}

    </div >
  )
}

export default MangaChaptersContainer