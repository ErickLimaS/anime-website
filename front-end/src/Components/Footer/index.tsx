import React, { useEffect, useState } from 'react'
import * as C from './styles'
import anilist from '../../API/anilist'
import { Link } from 'react-router-dom'

export default function Footer() {

  const [trending, setTrending] = useState<any>()

  useEffect(() => {

    //gets trending animes to show on footer
    const load = async () => {
      const data = await anilist.getTrending('ANIME', '', '')
      setTrending(data)
    }
    load()
  }, []

  )

  return (
    <C.Container>

      <div className='footer-info'>

        <div className='miscellaneous'>

          <div>
            <h1>Formats</h1>

            <ul>
              <li id='tv'><Link to={`/format/tv`}> TV</Link></li>
              <li id='manga'><Link to={`/format/manga`}> Manga</Link></li>
              <li id='one_shot'><Link to={`/format/one_shot`}> One Shot</Link></li>
              <li id='novel'><Link to={`/format/novel`}>Novel</Link></li>
              <li id='movie'><Link to={`/format/movie`}>Movie</Link></li>
              <li id='special'><Link to={`/format/special`}> Special</Link></li>
              <li id='ova'><Link to={`/format/ova`}> OVA</Link></li>
            </ul>
          </div>

          <div>
            <h1>Genres</h1>

            <ul>
              <li id='shounen'><Link to={`/genre/Shounen`}> Shounen</Link></li>
              <li id='shoujo'><Link to={`/genre/Shoujo`}>Shoujo</Link></li>
              <li id='seinen'><Link to={`/genre/Seinen`}> Seinen</Link></li>
              <li id='superpower'><Link to={`/genre/Super%20Power`} > Super Power</Link></li>
              <li id='school'><Link to={`/genre/School`}> School</Link></li>
              <li id='school'><Link to={`/genre/Historical`}> Historical</Link></li>
              <li id='school'><Link to={`/genre/War`}>War</Link></li>
            </ul>
          </div>

          <div className='project-info'>
            <h1>Esse Projeto</h1>
            <ul>
              <li>
                <a href='https://anilist.gitbook.io/anilist-apiv2-docs/' target='_blank' rel='noreferrer'>
                  AniList - API
                </a>
              </li>
              <li>
                <a href='https://github.com/ErickLimaS/anime-website' target='_blank' rel='noreferrer'>
                  Projeto no GitHub
                </a>
              </li>
              <li>
                <a href='https://erick-lima.netlify.app/' target='_blank' rel='noreferrer'>
                  Meu Portfólio
                </a>
              </li>
            </ul>
          </div>

          {(trending !== null || trending !== undefined) && (
            <div>
              <h1>Top 10 - Trending</h1>

              <ul>
                {trending?.map((item: any) => (
                  <li><Link to={`/anime/${item.id}`}>{item.title.romaji.length > 30 ? item.title.romaji.slice(0, 30) + `...` : item.title.romaji}</Link></li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      <small>Site feito para apenas para <a href='https://erick-lima.netlify.app/' target='_blank' rel='noreferrer'>meu portfólio.</a> Non-Commercial Use.</small>

    </C.Container>
  )
}
