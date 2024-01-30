"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import Link from 'next/link';
import Image from 'next/image';
import NavButtons from '../NavButtons';

type EpisodesType = {
  site: string,
  url: string,
  thumbnail: string,
  title: string
}

function EpisodesContainer(props: { data: EpisodesType[] }) {

  const { data } = props

  const [episodesDataFetched, setEpisodesDataFetched] = useState(data)

  const [pageNumber, setPageNumber] = useState<number>(0)

  const rangeEpisodesPerPage = 25
  // the length os episodes array will be divided by 25, getting the range of pagination
  const paginationNumber = Math.ceil((episodesDataFetched.length + 1) / rangeEpisodesPerPage)

  // set new page of episodes
  const setNewPage: (parameter: number) => void = async (parameter: number) => {

    console.log(`Episodes Page Parameter: ${parameter} `)

    setPageNumber(parameter)

  }

  // get range within the episodes and returns array of values to be shown on nav buttons
  const returnPaginationRange = () => {

    let buttonsOptions = []

    for (let i = 1; i <= paginationNumber; i++) {

      buttonsOptions.push({ name: i.toString(), value: i })

    }

    return buttonsOptions

  }

  useEffect(() => {
    setEpisodesDataFetched(data)
    returnPaginationRange()
  }, [])

  return (
    <>
      <ol id={styles.container}>

        {episodesDataFetched.slice(
          //if page is on 0 (is the default page number), it just begins from 0, after that it multiples by the number of page 
          (pageNumber != 0 ? (rangeEpisodesPerPage * (pageNumber - 1)) : 0),
          //if page is on 0, it will be set as 25, after that it multiples by the number of page 
          (pageNumber != 0 ? (rangeEpisodesPerPage * (pageNumber)) : (rangeEpisodesPerPage * (pageNumber + 1)))
        ).map((item, key: number) => (
          <li key={key}>
            <Link href={item.url} className={styles.img_container} target='_blank'>
              <Image
                src={item.thumbnail}
                fill
                alt={`Watch ${item.title}`}
                placeholder='blur'
                blurDataURL={'data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScgLz4KICAgICAgPC9maWx0ZXI+CgogICAgICA8aW1hZ2UgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZScgZmlsdGVyPSd1cmwoI2IpJyB4PScwJyB5PScwJyBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyAKICAgICAgaHJlZj0nZGF0YTppbWFnZS9hdmlmO2Jhc2U2NCwvOWovMndCREFBZ0dCZ2NHQlFnSEJ3Y0pDUWdLREJRTkRBc0xEQmtTRXc4VUhSb2ZIaDBhSEJ3Z0pDNG5JQ0lzSXh3Y0tEY3BMREF4TkRRMEh5YzVQVGd5UEM0ek5ETC8yd0JEQVFrSkNRd0xEQmdORFJneUlSd2hNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpML3dBQVJDQUFMQUJBREFTSUFBaEVCQXhFQi84UUFGZ0FCQVFFQUFBQUFBQUFBQUFBQUFBQUFCZ01ILzhRQUloQUFBZ0lDQWdFRkFRQUFBQUFBQUFBQUFRSURCQVVSQUNFU0JoTVVNVUhCLzhRQUZRRUJBUUFBQUFBQUFBQUFBQUFBQUFBQUFBTC94QUFaRVFBREFBTUFBQUFBQUFBQUFBQUFBQUFBQVJFQ0lUSC8yZ0FNQXdFQUFoRURFUUEvQU5KdFhNbEZqekxjaGZIMVl4dDVQa3B2ZjUzL0FEWGZJeGVzemtFclJZK3V0eVYxVVNsU3dDc1U4aHM2ME5nRTY0aEVVZCtrOWEzR2swRWkrTG82Z2dnOWNNNTJOYU9GdFdxbzltWlN6cXlIV2pvOWdmWDd3M3VsNHpoLy85az0nIC8+CiAgICA8L3N2Zz4KICA='}>
              </Image>
            </Link>

            <div>
              <h3><Link href={item.url} target='_blank'>{item.title}</Link></h3>
            </div>
          </li>
        ))}

      </ol>

      <div id={styles.pagination_buttons_container}>

        <NavButtons
          functionReceived={setNewPage as (parameter: string | number) => void}
          options={returnPaginationRange()}
          actualValue={pageNumber}
          previousAndNextButtons={true}
        />

      </div>

    </>
  )
}

export default EpisodesContainer