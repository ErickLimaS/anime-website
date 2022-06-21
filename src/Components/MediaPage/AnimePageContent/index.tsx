import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import AnimesReleasingThisWeek from '../../Home/AnimesReleasingThisWeekList'
import SearchInnerPage from '../../SearchInnerPage'

export default function AnimePageContent(data: any) {

  console.log(data.data)

  const [moreDetails, setMoreDetails] = useState<boolean>(false)
  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

  useEffect(() => {

    window.scrollTo(0, 0);

    let howManyPages: number = 0;
    let howMuchEpisodes: number = data.data.streamingEpisodes.length;

    if (data.data.streamingEpisodes.length <= 24) {
      setHowManyPagesPagination(1);
    }

    let episodesLeft = data.data.streamingEpisodes.length;
    while (episodesLeft > 0) {
      episodesLeft = episodesLeft - 24;
      howManyPages = howManyPages + 1;
      howMuchEpisodes = episodesLeft;
    }

    setHowManyPagesPagination(howManyPages - 1)

    // console.log(howManyPages + ' pages')
    // console.log(howMuchEpisodes + ' h m epis')
    // console.log(episodesLeft + ' ep left')

  }, [data.data.streamingEpisodes.length])

  console.log(howManyPagesPagination)

  return (
    <C.Container data={data.data}>

      <div className='search-mobile'>
        <SearchInnerPage />
      </div>

      <div className='banner-img'>
        {
          /* <img src={`${data.data.bannerImage}`} alt={`${data.data.title.romaji} Cover Art`} /> */
        }
      </div>

      <div className='name-and-description'>
        <h1>{data.data.title.romaji}</h1>

        <p>
          {data.data.description.length >= 420 ? (
            moreDetails === false ? (
              <p>
                {data.data.description.slice(0, 420)}
                <span onClick={() => setMoreDetails(!moreDetails)}> ...more details.</span>
              </p>
            ) : (
              <p>
                {data.data.description}
                <span onClick={() => setMoreDetails(!moreDetails)}> less details.</span>
              </p>
            )
          ) : (
            <p>{data.data.description}</p>
          )}
        </p>
      </div>

      {data.data.streamingEpisodes.length > 0 ? (
        <>
          <div className='heading'>

            <h2>Episodes</h2>

            <div>
              <DotSvg />
              <DotSvg />
            </div>
          </div>
          <div className='anime-episodes'>

            {indexEpisodesPagination === 0 && (

              data.data.streamingEpisodes.slice(0, 24).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}

            {indexEpisodesPagination === 1 && (

              data.data.streamingEpisodes.slice(24, 24 * 2).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}
            {indexEpisodesPagination === 2 && (

              data.data.streamingEpisodes.slice(24 * 2, 24 * 3).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}
            {indexEpisodesPagination === 3 && (

              data.data.streamingEpisodes.slice(24 * 3, 24 * 4).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}
            {indexEpisodesPagination === 4 && (

              data.data.streamingEpisodes.slice(24 * 4, 24 * 5).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}
            {indexEpisodesPagination === 5 && (

              data.data.streamingEpisodes.slice(24 * 5, 24 * 6).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}
            {indexEpisodesPagination === 6 && (

              data.data.streamingEpisodes.slice(24 * 6, 24 * 7).map((item: any, key: any) => (
                <div key={key} className='episode'>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                  </a>
                  <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                    <h3>{item.title}</h3>
                  </a>
                </div>
              ))

            )}

          </div>

          {data.data.streamingEpisodes.length > 26 && (
            <div className='pagination-buttons'>
              <button type='button'
                disabled={indexEpisodesPagination === 0 ? true : false}
                onClick={() => {
                  if (indexEpisodesPagination === 0) {
                    setIndexEpisodePagination(0)
                  } else {
                    setIndexEpisodePagination(indexEpisodesPagination - 1)
                  }
                }}>
                <AngleLeftSolidSvg />
              </button>

              <span>
                {indexEpisodesPagination + 1}
              </span>

              <button type='button'
                disabled={indexEpisodesPagination === howManyPagesPagination ? true : false}
                onClick={() => {
                  if (indexEpisodesPagination === howManyPagesPagination) {
                    setIndexEpisodePagination(0)
                  } else {
                    setIndexEpisodePagination(indexEpisodesPagination + 1)
                  }
                }}>
                <AngleRightSolidSvg />
              </button>
            </div>
          )}

        </>
      ) : (
        <div className='heading'>

          <h2>Theres no Episodes to Display Here!</h2>

        </div>
      )
      }

      {data.data.recommendations.edges && (
        <div className='similar-animes'>
          <h2>Similar to <span>{data.data.title.romaji}</span></h2>

          <ul>
            {data.data.recommendations.edges.slice(0, 8).map((item: any) => (
              <li><AnimesReleasingThisWeek data={item.node.mediaRecommendation} /></li>
            ))}
          </ul>
        </div>
      )}

    </C.Container >
  )
}
