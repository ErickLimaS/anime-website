import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import AnimesReleasingThisWeek from '../../Home/AnimesReleasingThisWeekList'
import SearchInnerPage from '../../SearchInnerPage'
import { Link } from 'react-router-dom'
import CharacterAndActor from '../../CharacterAndActor'

export default function MoviePageContent(data: any) {

  const [indexPageInfo, setIndexPageInfo] = useState(0)

  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

  const [mainCastCharacters, setMainCastCharacters] = useState([])
  const [supportingCastCharacters, setSupportingCastCharacters] = useState([])

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

    //gets the main and support characters
    const mainChar = data.data.characters.edges.filter((item: any) => {
      return item.role === 'MAIN'
    })
    setMainCastCharacters(mainChar)
    console.log(mainChar)

    const supChar = data.data.characters.edges.filter((item: any) => {
      return item.role === 'SUPPORTING'
    })
    setSupportingCastCharacters(supChar)
    console.log(supChar)

    // console.log(data.data)

  }, [data.data.streamingEpisodes.length])

  console.log(howManyPagesPagination)

  return (
    <C.Container data={data.data} indexHeading={indexPageInfo}>

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

        <p>{data.data.description}</p>

      </div>

      <div className='heading'>

        <div className='nav'>
          <h2 id='h2-0' onClick={() => setIndexPageInfo(0)}>Cast</h2>
          <h2 id='h2-1' onClick={() => setIndexPageInfo(1)}>More Info</h2>
        </div>

        <div className='svg-dots'>
          <DotSvg />
          <DotSvg />
        </div>
      </div>

      {indexPageInfo === 0 && (
        <div className='cast'>

          <h1>Main Cast</h1>

          {mainCastCharacters.map((item: any, key: any) => (
            <CharacterAndActor data={item} key={key} />
          ))}

          {/* 
          <h1>Supporting Cast</h1>

          {supportingCastCharacters.map((item: any, key: any) => (
            <CharacterAndActor data={item} key={key} />
          ))} */}
        </div>
      )}

      {indexPageInfo === 1 && (
        <ul className='more-info'>
          {data.data.source && (
            <li>Source: <span>{data.data.source}</span></li>
          )}
          {data.data.countryOfOrigin && (
            <li>From <span>{data.data.countryOfOrigin}</span></li>
          )}
          {data.data.favourites && (
            <li><span>{data.data.favourites}</span> Marked as One of Their Favorite </li>
          )}
          {data.data.studios.edges && (
            <li><span>Studios</span>:
              <ul className='studios'>
                {data.data.studios.edges.map((item: any) => (
                  <li>
                    <a href={`${item.node.siteUrl}`} target='_blank' rel='noreferrer' >
                      {item.node.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          )}
          {data.data.tags && (

            <li><span>Tags</span>:
              <ul className='tags'>
                {data.data.tags.map((item: any) => (
                  <li>{item.name}</li>
                ))}
              </ul>
            </li>

          )}
        </ul>
      )}

      {data.data.relations.nodes && (
        <div className='from-same-franchise'>

          <h2>From Same Franchise</h2>

          <ul>
            {data.data.relations.nodes.map((item: any) => (
              <li>
                <AnimesReleasingThisWeek data={item} />
              </li>
            ))}
          </ul>

        </div>
      )}

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
