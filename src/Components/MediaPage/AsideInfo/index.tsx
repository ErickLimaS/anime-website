import React, { useEffect, useLayoutEffect, useState } from 'react'
import SearchInnerPage from '../../SearchInnerPage'
import * as C from './styles'

export default function AsideInfo(data: any) {

  const [nextEpisodeDate, setNextEpisodeDate] = useState<any>(data.data.nextAiringEpisode && new Date(data.data.nextAiringEpisode.airingAt * 1000));
  let aux: any;

  return (
    <C.Container data={data.data}>

      {data.data.length === 0 ? (

        <div className='skeleton'>

          loading

        </div>

      ) : (
        <>
          <SearchInnerPage />

          <div className='info-aside'>

            <div className='info-heading'>

              <img src={`${data.data.coverImage.medium}`} alt={`${data.data.title.romaji} Cover Art`}>
              </img>
              <h1>{data.data.title.romaji}</h1>

            </div>

            <div className='type'>
              <h2>{data.data.type}</h2>
            </div>

            <ul>
              {data.data.episodes && (
                <li>{data.data.episodes} Episodes</li>
              )}

              {data.data.status === 'RELEASING' && (

                <li className='releasing'>Status: Releasing</li>

              )}

              {data.data.nextAiringEpisode && (
                <li className='releasing'>Next Episode on {nextEpisodeDate.getDate()}/{nextEpisodeDate.getMonth() + 1}/{nextEpisodeDate.getYear()}</li>
              )}

              <li>{data.data.duration} Minutes Each Episode</li>

              <li>First Transmition: {data.data.startDate.day && `${data.data.startDate.day}/`}{data.data.startDate.month && `${data.data.startDate.month}/`}{data.data.startDate.year && `${data.data.startDate.year}`}</li>
              {data.data.status === 'FINISHED' && (

                <li>Last Transmition: {data.data.endDate.day && `${data.data.endDate.day}/`}{data.data.endDate.month && `${data.data.endDate.month}/`}{data.data.endDate.year && `${data.data.endDate.year}`}</li>

              )}

              {/* Fix for more studios */}
              {data.data.studios.edges && (
                <li>
                  Studios:
                  {data.data.studios.edges.slice(0, 3).map((item: any) => (
                    <a href={`${item.node.siteUrl}`} target='_blank' rel='noreferrer'> {item.node.name}</a>
                  ))}
                </li>
              )}
            </ul>
            {data.data.trailer && (
              <div className='trailer'>
                <h2>Trailer</h2>
                <a href={`http://youtu.be/${data.data.trailer.id}`} target='_blank' rel='noreferrer'>
                  <img src={data.data.trailer.thumbnail} alt={`Trailer of ${data.data.title.romaji}`}></img>
                </a>
              </div>
            )}
            
            {data.data.genres && (
              <div className='genres'>
                <h2>Genres</h2>
                <ul>
                  {data.data.genres.map((item: any) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className='characters'>
              <h2>Characters</h2>

              <ul>
                {data.data.characters.edges.slice(0, 6).map((item: any) => (
                  <li>
                    <div className='img'>
                      <img src={`${item.node.image.medium}`} alt={`${item.node.name.full}`} />
                    </div>
                    <h3>{item.node.name.full}</h3>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </>
      )}

    </C.Container>
  )
}
