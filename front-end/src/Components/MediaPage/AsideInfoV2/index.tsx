import React, { useEffect, useLayoutEffect, useState } from 'react'
import Score from '../../Score';
import SearchInnerPage from '../../SearchInnerPage'
import * as C from './styles'

export default function AsideInfoV2(data: any) {

  const [nextEpisodeDate, setNextEpisodeDate] = useState<any>(data.data.nextAiringEpisode && new Date(data.data.nextAiringEpisode.airingAt * 1000));

  return (
    <C.Container data={data.data}>

      {data.data.length === 0 ? (

        <div className='skeleton'>

        </div>

      ) : (
        <>
          <div className='search-desktop'>
            <SearchInnerPage />
          </div>

          <div className='info-aside'>

            <div className='info-heading'>

              <img src={`${data.data.animeImg}`} alt={`${data.data.animeTitle} Cover Art`}>
              </img>
              <h1>{data.data.animeTitle}</h1>

            </div>

            <div className='type'>

              <h2>{data.data.type}</h2>

            </div>

            <ul className='general-info'>
              {data.data.totalEpisodes && (
                <li><strong>{data.data.totalEpisodes} Episodes</strong></li>
              )}

              {data.data.chapters && (
                <li><strong>{data.data.chapters} Chapters</strong></li>
              )}

              {data.data.volumes && (
                <li><strong>{data.data.volumes} Volumes</strong></li>
              )}

              {data.data.status && (

                <li className='releasing'>Status: <span>{data.data.status}</span></li>

              )}

              {(data.data.format === 'MOVIE' && (

                <li>Released on <span>{data.data.releaseDate}</span></li>

              ))}

            </ul>

            {data.data.genres && (
              <div className='genres'>
                <h2>Genres</h2>
                <ul>
                  {data.data.genres.map((item: any, key: any) => (
                    <li key={key}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        </>
      )
      }

    </C.Container >
  )
}
