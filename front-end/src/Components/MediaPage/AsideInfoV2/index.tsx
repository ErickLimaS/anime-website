import React, { useEffect, useLayoutEffect, useState } from 'react'
import Score from '../../Score';
import SearchInnerPage from '../../SearchInnerPage'
import * as C from './styles'
import { ReactComponent as WatchSvg } from '../../../imgs/svg/watch.svg'
import { ReactComponent as BookSvg } from '../../../imgs/svg/book.svg'
import { ReactComponent as PlayCaretSvg } from '../../../imgs/svg/caret-right-square.svg'
import { ReactComponent as BrodcastSvg } from '../../../imgs/svg/broadcast-pin.svg'
import { ReactComponent as CollectionEpisodesSvg } from '../../../imgs/svg/collection-play.svg'

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
                <li><CollectionEpisodesSvg /> <strong>{data.data.totalEpisodes} Episode{data.data.totalEpisodes > 1 && ('s')}</strong></li>
              )}

              {data.data.chapters && (
                <li><BookSvg /> <strong>{data.data.chapters} Chapter{data.data.chapters > 1 && ('s')}</strong></li>
              )}

              {data.data.volumes && (
                <li><BookSvg /> <strong>{data.data.volumes} Volume{data.data.volumes > 1 && ('s')}</strong></li>
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
