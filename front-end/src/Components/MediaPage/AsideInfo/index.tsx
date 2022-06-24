import React, { useEffect, useLayoutEffect, useState } from 'react'
import Score from '../../Score';
import SearchInnerPage from '../../SearchInnerPage'
import * as C from './styles'

export default function AsideInfo(data: any) {

  const [nextEpisodeDate, setNextEpisodeDate] = useState<any>(data.data.nextAiringEpisode && new Date(data.data.nextAiringEpisode.airingAt * 1000));

  return (
    <C.Container data={data.data}>

      {data.data.length === 0 ? (

        <div className='skeleton'>

          loading

        </div>

      ) : (
        <>
          <div className='search-desktop'>
            <SearchInnerPage />
          </div>

          <div className='info-aside'>

            <div className='info-heading'>

              <img src={`${data.data.coverImage.medium}`} alt={`${data.data.title.romaji} Cover Art`}>
              </img>
              <h1>{data.data.title.romaji}</h1>

            </div>

            {data.data.averageScore && (
              <div className='title-score'>
                <Score data={data.data.averageScore} />
              </div>
            )}

            <div className='type'>
              {(data.data.format === 'MOVIE' && (

                <h2>{data.data.format}</h2>

              )) || (data.data.type === 'ANIME' && (

                <h2>{data.data.type}</h2>
                
              )) || (data.data.type === 'MANGA' && (

                <h2>{data.data.type}</h2>
                
              ))}
            </div>

            <ul className='general-info'>
              {data.data.format === 'MOVIE' ? (

                <>
                </>

              ) : (
                data.data.episodes && (
                  <li><strong>{data.data.episodes} Episodes</strong></li>
                )
              )}


              {data.data.chapters && (
                <li><strong>{data.data.chapters} Chapters</strong></li>
              )}

              {data.data.volumes && (
                <li><strong>{data.data.volumes} Volumes</strong></li>
              )}

              {data.data.status === 'RELEASING' && (

                <li className='releasing'>Status: <span>Releasing</span></li>

              )}

              {data.data.nextAiringEpisode && (
                <li className='releasing'>Next Episode on <span>{nextEpisodeDate.getDate()}/{nextEpisodeDate.getMonth() + 1}/{nextEpisodeDate.getYear()}</span></li>
              )}

              {(data.data.format === 'MOVIE' && (

                <li>{data.data.duration} Minutes Long </li>

              )) || (data.data.type === 'ANIME' && (

                <li>{data.data.duration} Minutes Long Each Episode</li>

              ))}

              {(data.data.format === 'MOVIE' && (
                <li>Released on <span>
                  {data.data.startDate.day && `${data.data.startDate.day}/`}{data.data.startDate.month && `${data.data.startDate.month}/`}{data.data.startDate.year && `${data.data.startDate.year}`}
                </span>
                </li>
              )) || (data.data.type === 'MANGA' && (
                <li>First Release on <span>
                  {data.data.startDate.day && `${data.data.startDate.day}/`}{data.data.startDate.month && `${data.data.startDate.month}/`}{data.data.startDate.year && `${data.data.startDate.year}`}
                </span>
                </li>
              )) || (data.data.type === 'ANIME' && (
                <li>First Transmition on <span>
                  {data.data.startDate.day && `${data.data.startDate.day}/`}{data.data.startDate.month && `${data.data.startDate.month}/`}{data.data.startDate.year && `${data.data.startDate.year}`}</span>
                </li>

              ))}

              {data.data.status === 'FINISHED' && (

                (data.data.format === 'MOVIE' && (
                  <>
                  </>
                )) || (data.data.type === 'ANIME' && (

                  <li>Last Transmition on <span>{data.data.endDate.day && `${data.data.endDate.day}/`}{data.data.endDate.month && `${data.data.endDate.month}/`}{data.data.endDate.year && `${data.data.endDate.year}`}</span></li>

                )) || (data.data.type === 'MANGA' && (

                  <li>Last Release on <span>
                    {data.data.startDate.day && `${data.data.endDate.day}/`}{data.data.endDate.month && `${data.data.endDate.month}/`}{data.data.endDate.year && `${data.data.endDate.year}`}
                  </span>
                  </li>

                ))
              )}

              {/* Fix for more studios */}
              {data.data.studios.edges.length > 0 && (
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

                {/* //   <a href={`http://youtu.be/${data.data.trailer.id}`} target='_blank' rel='noreferrer'>
              //     <img src={data.data.trailer.thumbnail} alt={`Trailer of ${data.data.title.romaji}`}></img>
              //   </a> */}

                <iframe width='100%' height='240px' title='Trailer' src={`https://www.youtube.com/embed/${data.data.trailer.id}`}>

                </iframe>

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
      )
      }

    </C.Container >
  )
}
