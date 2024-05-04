"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css";
import Link from 'next/link';
import { MangaChapters, MangaInfo } from '@/app/ts/interfaces/apiMangadexDataInterface';
import BookSvg from "@/public/assets/book.svg"
import NavPaginateItems from '@/app/media/[id]/components/PaginateItems';
import Image from 'next/image';
import ErrorImg from "@/public/error-img-2.png"
import manga from '@/api/manga';
import { AnimatePresence, motion } from 'framer-motion';
import simulateRange from '@/app/lib/simulateRange';
import ButtonMarkChapterAsRead from '@/app/components/ButtonMarkChapterAsRead';
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import { getClosestMangaResultByTitle } from '@/app/lib/fetchMangaOnApi';
import { stringToUrlFriendly } from '@/app/lib/convertStringsTo';

const loadingChaptersMotion = {
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

function MangaChaptersContainer({ mediaData }: { mediaData: ApiMediaResults }) {

  const [loading, setLoading] = useState(true)
  const [chaptersDataFetched, setChaptersDataFetched] = useState<MangaChapters[]>([])

  const [currentItems, setCurrentItems] = useState<MangaChapters[] | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [itemOffset, setItemOffset] = useState<number>(0);

  const rangeChaptersPerPage = 10

  function handlePageClick(event: { selected: number }) {

    setLoading(true) // needed to refresh chapters component "Mark Chapters Read"

    const newOffset = event.selected * rangeChaptersPerPage % chaptersDataFetched.length

    setItemOffset(newOffset)

    setTimeout(() => setLoading(false), 500)  // needed to refresh chapters component "Mark Chapters Read"

  }

  async function getChapters() {

    setLoading(true)

    let mangaInfo

    const query = stringToUrlFriendly(mediaData.title.romaji).toLowerCase()

    mangaInfo = await manga.getInfoFromThisMedia(query) as MangaInfo

    // if the query dont match any id result, it will search results for this query,
    // than make the first request by the ID of the first search result 
    if (!mangaInfo) {

      const closestResult = await getClosestMangaResultByTitle(query, mediaData)

      mangaInfo = await manga.getInfoFromThisMedia(closestResult as string) as MangaInfo

      if (!mangaInfo) {

        setLoading(false)

        setCurrentItems(null)

        return

      }

    }

    setChaptersDataFetched(mangaInfo.chapters.filter(item => item.pages != 0))

    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrentItems(mangaInfo.chapters.filter(item => item.pages != 0).slice(itemOffset, endOffset));
    setPageCount(Math.ceil(mangaInfo.chapters.filter(item => item.pages != 0).length / rangeChaptersPerPage));

    setLoading(false)

  }

  useEffect(() => {

    // Fetch items 
    if (chaptersDataFetched.length == 0) {
      getChapters()
    }

    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrentItems(chaptersDataFetched.slice(itemOffset, endOffset));

  }, [itemOffset, rangeChaptersPerPage]);

  return (
    <div>

      <AnimatePresence>
        <motion.ol
          id={styles.container}
          data-loading={loading}
          variants={loadingChaptersMotion}
          initial="initial"
          animate="animate"
          exit="exit"
        >

          {/* LOADING */}
          {loading && (
            <motion.div
              id={styles.loading_chapters_container}
              variants={loadingChaptersMotion}
              initial="initial"
              animate="animate"
              exit="exit"
            >

              {simulateRange(10).map((item, key) => (

                <motion.div
                  key={key}
                  variants={loadingChaptersMotion}
                />

              ))}

            </motion.div>
          )}

          {/* SHOWS WHEN THERES NO RESULTS  */}
          {!loading && (chaptersDataFetched.length == 0 || currentItems == null) && (
            <div id={styles.no_chapters_container}>

              <Image src={ErrorImg} alt='Error' height={200} />

              <p>No chapters available.</p>

            </div>
          )}

          {(currentItems && !loading) && currentItems.map((item, key: number) => (
            <motion.li
              key={key}
              title={`Chapter ${item.chapterNumber} - ${mediaData.title.romaji}`}
              data-disabled={item.pages == 0}
              variants={loadingChaptersMotion}
              className={styles.chapter_container}
            >

              <div className={styles.icon_container}>
                <BookSvg alt="Book Opened Icon" width={16} heighy={16} />
              </div>

              <Link href={`/read/${mediaData.id}?source=mangadex&chapter=${item.chapterNumber}&q=${item.id}`}>
                <div className={styles.info_container}>

                  <h3>{item.title != item.chapterNumber ? `Chapter ${item.chapterNumber}: ${item.title}` : `Chapter ${item.chapterNumber}` || "Not Available"}</h3>

                  <p>{item.pages == 0 ? "No Pages Found!" : `${item.pages} Pages`}</p>

                </div>

              </Link>

              <ButtonMarkChapterAsRead
                chapterNumber={Number(item.chapterNumber)}
                chapterTitle={item.title}
                mediaId={mediaData.id}
                hasText
              />

            </motion.li>
          ))}

        </motion.ol>
      </AnimatePresence>

      {chaptersDataFetched.length > 0 && (
        <nav id={styles.pagination_buttons_container}>

          <NavPaginateItems
            onPageChange={handlePageClick}
            pageCount={pageCount}
          />

        </nav>
      )}

    </div >
  )
}

export default MangaChaptersContainer