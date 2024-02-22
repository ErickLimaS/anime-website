"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import Link from 'next/link';
import gogoanime from '@/api/gogoanime';
import { MangaChapters, MangaInfo, MangaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import BookSvg from "@/public/assets/book.svg"
import NavPaginateItems from '@/app/components/PaginateItems';

function MangaChaptersContainer({ mangaTitle }: { mangaTitle: string }) {

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

    const query = mangaTitle.replace(/[^a-z]+/i, ' ').split(" ").join("_").toLowerCase()

    mangaInfo = await gogoanime.getInfoFromThisMedia(query, "manga") as MangaInfo

    // if the query dont match any id result, it will search results for this query,
    // than make the first request by the ID of the first search result 
    if (mangaInfo.title == "") {
      const searchResultsForMedia = await gogoanime.searchMedia(query, "manga") as MangaSearchResult[]

      mangaInfo = await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0].id, "manga") as MangaInfo
    }

    // sort ASC chapters
    const data = mangaInfo.chapters.sort((a, b) => {
      if (a.title < b.title) {
        return -1 as any;
      }
    });

    setChaptersDataFetched(data)

    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / rangeChaptersPerPage));

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

        {currentItems && currentItems.map((item: any, key: number) => (

          <li key={key} >
            <Link href={`http://www.mangahere.cc/manga/${item.id}/1.html`} className={styles.chapter_container} target='_blank'>
              <div className={styles.icon_container}>
                <BookSvg alt="Book Opened Icon" width={16} heighy={16} />
              </div>

              <div className={styles.info_container}>
                <h3>{item.title || "Not Available"}</h3>

                <p>{item.releasedDate}</p>
              </div>
            </Link>
          </li>
        ))}

      </ol>

      {!loading && chaptersDataFetched.length == 0 && (
        <p>No chapters available.</p>
      )}
      {loading && (
        <p>Loading...</p>
      )}

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