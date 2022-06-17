import React, { useState } from 'react'
import * as C from './styles'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import AnimesReleasingThisWeek from '../../Home/AnimesReleasingThisWeekList'

export default function AnimePageContent(data: any) {

  console.log(data.data)

  const [moreDetails, setMoreDetails] = useState(false)

  return (
    <C.Container data={data.data}>

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

      <div className='heading'>

        <h2>Episodes</h2>

        <div>
          <DotSvg />
          <DotSvg />
        </div>
      </div>

      <div className='anime-episodes'>

        {data.data.streamingEpisodes.map((item: any, key: any) => (
          <div key={key} className='episode'>
            <a href={`${item.url}`} target='_blank' rel='noreferrer'>
              <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
            </a>
            <a href={`${item.url}`} target='_blank' rel='noreferrer'>
              <h3>{item.title}</h3>
            </a>
          </div>
        ))}

      </div>

      <div className='similar-animes'>
        <h2>Similar to <span>{data.data.title.romaji}</span></h2>

        <ul>
          {data.data.recommendations.edges.slice(0, 8).map((item: any) => (
            <li><AnimesReleasingThisWeek data={item.node.mediaRecommendation} /></li>
          ))}
        </ul>
      </div>

    </C.Container>
  )
}
