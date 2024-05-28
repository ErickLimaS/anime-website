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
import { getClosestMangaResultByTitle } from '@/app/lib/optimizedFetchMangaOptions';
import { stringToUrlFriendly } from '@/app/lib/convertStrings';

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
  const [chaptersList, setChaptersList] = useState<MangaChapters[]>([])

  const [currMangasList, setCurrMangasList] = useState<MangaChapters[] | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(0)

  const [itemOffset, setItemOffset] = useState<number>(0)

  const rangeChaptersPerPage = 10

  useEffect(() => {

    if (chaptersList.length == 0) fetchMangaChapters()

    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrMangasList(chaptersList.slice(itemOffset, endOffset));

  }, [itemOffset, rangeChaptersPerPage])

  function handleButtonPageNavigation(event: { selected: number }) {

    setIsLoading(true) // Needed to refresh chapters component "Mark Chapters Read"

    const newOffset = event.selected * rangeChaptersPerPage % chaptersList.length

    setItemOffset(newOffset)

    setTimeout(() => setIsLoading(false), 500)  // Needed to refresh chapters component "Mark Chapters Read"

  }

  async function fetchMangaChapters() {

    setIsLoading(true)

    const mangaTitleUrlFrindly = stringToUrlFriendly(mediaInfo.title.romaji).toLowerCase()

    let mangaInfo = await manga.getInfoFromThisMedia({ id: mangaTitleUrlFrindly }) as MangaInfo

    if (!mangaInfo) {

      const mangaClosestResult = await getClosestMangaResultByTitle(mangaTitleUrlFrindly, mediaInfo)

      mangaInfo = await manga.getInfoFromThisMedia({ id: mangaClosestResult as string }) as MangaInfo

      if (!mangaInfo) {

        setIsLoading(false)

        setCurrMangasList(null)

        return

      }

    }

    setChaptersList(mangaInfo.chapters.filter(item => item.pages != 0))

    const endOffset = itemOffset + rangeChaptersPerPage

    setCurrMangasList(mangaInfo.chapters.filter(item => item.pages != 0).slice(itemOffset, endOffset))

    setPageNumber(Math.ceil(mangaInfo.chapters.filter(item => item.pages != 0).length / rangeChaptersPerPage))

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
          {!isLoading && (chaptersList.length == 0 || currMangasList == null) && (
            <div id={styles.no_chapters_container}>

              <Image src={ErrorImg} alt='Error' height={200} />

              <p>No chapters available.</p>

            </div>
          )}

          {(currMangasList && !isLoading) && currMangasList.map((chapter, key) => (
            <motion.li
              key={key}
              title={`Chapter ${chapter.chapterNumber} - ${mediaInfo.title.romaji}`}
              data-disabled={chapter.pages == 0}
              variants={framerMotionLoadingChapters}
              className={styles.chapter_container}
            >

              <div className={styles.icon_container}>
                <BookSvg alt="Book Opened Icon" width={16} heighy={16} />
              </div>

              <Link href={`/read/${mediaInfo.id}?source=mangadex&chapter=${chapter.chapterNumber}&q=${chapter.id}`}>
                <div className={styles.info_container}>

                  <h3>{chapter.title != chapter.chapterNumber ? `Chapter ${chapter.chapterNumber}: ${chapter.title}` : `Chapter ${chapter.chapterNumber}` || "Not Available"}</h3>

                  <p>{chapter.pages == 0 ? "No Pages Found!" : `${chapter.pages} Pages`}</p>

                </div>

              </Link>

              <MarkChapterAsReadButton
                chapterNumber={Number(chapter.chapterNumber)}
                chapterTitle={chapter.title}
                mediaId={mediaInfo.id}
                showAdditionalText
              />

            </motion.li>
          ))}

        </motion.ol>
      </AnimatePresence>

      {chaptersList.length > 0 && (
        <nav id={styles.pagination_buttons_container}>

          <NavPaginateItems
            onPageChange={handleButtonPageNavigation}
            pageCount={pageNumber}
          />

        </nav>
      )}

    </div >
  )
}

export default MangaChaptersContainer