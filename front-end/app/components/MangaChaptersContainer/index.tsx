"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import Link from 'next/link';
import NavButtons from '../NavButtons';
import gogoanime from '@/api/gogoanime';
import { MangaChapters, MangaInfo, MangaSearchResult, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface';
import BookSvg from "@/public/assets/book.svg"

function MangaChaptersContainer({ mangaTitle }: { mangaTitle: string }) {

  const [loading, setLoading] = useState(true)
  const [chaptersDataFetched, setChaptersDataFetched] = useState<MangaChapters[]>([])

  const [pageNumber, setPageNumber] = useState<number>(0)

  const rangeChaptersPerPage = 10

  // set new page of chapters
  const setNewPage: (parameter: number) => void = async (parameter: number) => {

    console.log(`Chapters Page Parameter: ${parameter} `)

    setPageNumber(parameter)

  }

  // get range within the chapters and returns array of values to be shown on nav buttons
  const returnPaginationRange = () => {

    // the length os episodes array will be divided by 25, getting the range of pagination
    const paginationNumber = Math.ceil((chaptersDataFetched.length + 1) / rangeChaptersPerPage)

    let buttonsOptions = []

    for (let i = 1; i <= paginationNumber; i++) {

      buttonsOptions.push({ name: i.toString(), value: i })

    }

    return buttonsOptions

  }

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

    const data = mangaInfo.chapters.sort((a, b) => {
      if (a.title < b.title) {
        return -1 as any;
      }
    });

    setChaptersDataFetched(data)

    setLoading(false)

    setLoading(false)

  }

  useEffect(() => {
    getChapters()

    returnPaginationRange()
  }, [])

  return (
    <div>

      <ol id={styles.container} data-loading={loading}>

        {chaptersDataFetched && chaptersDataFetched.slice(
          //if page is on 0 (is the default page number), it just begins from 0, after that it multiples by the number of page 
          (pageNumber != 0 ? (rangeChaptersPerPage * (pageNumber - 1)) : 0),
          //if page is on 0, it will be set as 25, after that it multiples by the number of page 
          (pageNumber != 0 ? (rangeChaptersPerPage * (pageNumber)) : (rangeChaptersPerPage * (pageNumber + 1)))
        ).map((item, key: number) => (

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

          <NavButtons
            functionReceived={setNewPage as (parameter: string | number) => void}
            options={returnPaginationRange()}
            actualValue={pageNumber}
            previousAndNextButtons={true}
            customForPagination={true}
          />

        </nav>
      )}

    </div >
  )
}

export default MangaChaptersContainer