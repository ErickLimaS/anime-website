"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import Link from 'next/link';
import { MangaChapters, MangaInfo, MangaSearchResult } from '@/app/ts/interfaces/apiMangadexDataInterface';
import BookSvg from "@/public/assets/book.svg"
import OutsideLinkSvg from "@/public/assets/box-arrow-up-right.svg"
import NavPaginateItems from '@/app/media/[id]/components/PaginateItems';
import Image from 'next/image';
import ErrorImg from "@/public/error-img-2.png"
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly';
import manga from '@/api/manga';

function MangaChaptersContainer({ mangaTitle, mediaId }: { mangaTitle: string, mediaId: number }) {

  const [loading, setLoading] = useState(true)
  const [chaptersDataFetched, setChaptersDataFetched] = useState<MangaChapters[]>([])

  const [currentItems, setCurrentItems] = useState<MangaChapters[] | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [itemOffset, setItemOffset] = useState<number>(0);

  const rangeChaptersPerPage = 10

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = event.selected * rangeChaptersPerPage % chaptersDataFetched.length;

    setItemOffset(newOffset);
  };

  const getChapters = async () => {

    setLoading(true)

    let mangaInfo

    const query = stringToUrlFriendly(mangaTitle).toLowerCase()

    mangaInfo = await manga.getInfoFromThisMedia(query) as MangaInfo

    // if the query dont match any id result, it will search results for this query,
    // than make the first request by the ID of the first search result 
    if (!mangaInfo) {
      const searchResultsForMedia = await manga.searchMedia(query) as MangaSearchResult[]

      mangaInfo = await manga.getInfoFromThisMedia(searchResultsForMedia[0]?.id) as MangaInfo
    }

    setChaptersDataFetched(mangaInfo.chapters)

    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrentItems(mangaInfo.chapters.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(mangaInfo.chapters.length / rangeChaptersPerPage));

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

      <ol id={styles.container} data-loading={loading}>

        {/* LOADING */}
        {loading && (
          <p>Loading...</p>
        )}

        {/* SHOWS WHEN THERES NO RESULTS  */}
        {!loading && (chaptersDataFetched.length == 0 || currentItems == null) && (
          <div id={styles.no_chapters_container}>

            <Image src={ErrorImg} alt='Error' height={200} />

            <p>No chapters available.</p>

          </div>
        )}

        {currentItems && currentItems.map((item, key: number) => (
          <li key={key} title={`Chapter ${item.chapterNumber} - ${mangaTitle}`}>
            <Link href={`/read/${mediaId}?source=mangadex&chapter=${item.chapterNumber}&q=${item.id}`} className={styles.chapter_container}>
              <div className={styles.icon_container}>
                <BookSvg alt="Book Opened Icon" width={16} heighy={16} />
              </div>

              <div className={styles.info_container}>
                <h3>{item.title != item.chapterNumber ? `Chapter ${item.chapterNumber}: ${item.title}` : `Chapter ${item.chapterNumber}` || "Not Available"}</h3>

                <p>{item.pages == 0 ? "No Pages Found!" : `${item.pages} Pages`}</p>

                {/* <p>{item.releasedDate}</p> */}

              </div>

              {/* <div className={styles.icon_container} style={{ transform: "scale(0.8)" }}>
                <OutsideLinkSvg alt="Outside of this site Icon" width={16} heighy={16} />
              </div> */}

            </Link>
          </li>
        ))}

      </ol>


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