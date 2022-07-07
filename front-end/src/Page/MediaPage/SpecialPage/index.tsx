import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import AsideInfo from '../../../Components/MediaPage/AsideInfo'
import * as C from './styles'
import API from '../../../API/anilist'
import MangaPageContent from '../../../Components/MediaPage/MangaPageContent'

export default function SpecialPage() {

  const { id } = useParams();
  const type = 'ANIME'
  const format = 'SPECIAL'

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

      document.title = `${data.title.romaji} | Manga`

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
            <MangaPageContent data={animeInfo} />

            <AsideInfo data={animeInfo} />

          </>
        )}

      </div>
    </C.Container>
  )
}
