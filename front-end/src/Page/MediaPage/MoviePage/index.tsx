import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import AsideInfo from '../../../Components/MediaPage/AsideInfo'
import * as C from './styles'
import API from '../../../API/anilist'
import MoviePageContent from '../../../Components/MediaPage/MoviePageContent'

export default function MoviePage() {

  const { id } = useParams();
  const type = 'ANIME'
  const format = 'MOVIE' //Only thi page who declares what format it is. Others has a exception on API file to redirect to the right format for their page

  const [animeInfo, setAnimeInfo] = useState([] as any[])
  // const [animeEpisodes, setAnimeEpisodes] = useState([] as any[])

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    const load = async (id: any, type: String) => {

      document.title = 'Loading'

      setLoading(true)

      const data = await API.getInfoFromThisMedia(id, type, format);
      setAnimeInfo(data)
      console.log(data)

      setLoading(false)

      document.title = `${data.title.romaji} | Movie`

    }
    load(id, type)

  }, [id])

  return (
    <C.Container loading={loading}>

      <AsideNavLinks />

      <div className={loading === true ? 'skeleton' : 'main'}>

        <div>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>

        </div>

        <div>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
        </div>

        {loading === false && (
          <>
            <MoviePageContent data={animeInfo} />

            <AsideInfo data={animeInfo} />

          </>
        )}

      </div>
    </C.Container>
  )
}
