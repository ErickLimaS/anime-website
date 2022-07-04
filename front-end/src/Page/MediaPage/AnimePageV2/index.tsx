import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import AsideInfo from '../../../Components/MediaPage/AsideInfo'
import * as C from './styles'
import API from '../../../API/anilist'
import gogoAnime from '../../../API/gogo-anime'
import AnimePageContent from '../../../Components/MediaPage/AnimePageContent'
import AnimePageContentV2 from '../../../Components/MediaPage/AnimePageContentV2'
import AsideInfoV2 from '../../../Components/MediaPage/AsideInfoV2'

export default function AnimePageV2() {

  const { id } = useParams();
  const type = 'ANIME'

  const [animeInfo, setAnimeInfo] = useState([] as any[])
  // const [animeEpisodes, setAnimeEpisodes] = useState([] as any[])

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    const load = async (id: any) => {

      document.title = 'Loading'

      setLoading(true)

      const data = await gogoAnime.getInfoFromThisMedia(id);
      setAnimeInfo(data)

      setLoading(false)

      document.title = `${data.animeTitle} (GoGoAnime)`

    }
    load(id)

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

            <AnimePageContentV2 data={animeInfo} />

            <AsideInfoV2 data={animeInfo} />

          </>
        )}

      </div>
    </C.Container>
  )
}
