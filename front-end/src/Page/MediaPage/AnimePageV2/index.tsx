import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AsideNavLinks from '../../../Components/Layout/AsideNavLinks'
import * as C from './styles'
import gogoAnime from '../../../API/gogo-anime'
import AnimePageContentV2 from '../../../Components/MediaPage/AnimePageContentV2'
import AsideInfoV2 from '../../../Components/MediaPage/AsideInfoV2'

export default function AnimePageV2() {

  const { id } = useParams();

  const [animeInfo, setAnimeInfo] = useState([] as any[])

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    const load = async (id: any) => {

      document.title = 'Loading | AniProject'
      window.scrollTo(0, 0);

      setLoading(true)

      const data = await gogoAnime.getInfoFromThisMedia(id);
      setAnimeInfo(data)

      setLoading(false)

      document.title = `${data.animeTitle} | AniProject`

    }
    load(id)

  }, [id])

  return (
    <C.Container loading={loading}>

      <AsideNavLinks />

      <div className={loading === true ? 'skeleton' : 'main'}>

        {loading === true ? (
          <>
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
          </>
        ) : (

          <>

            <AnimePageContentV2 data={animeInfo} />

            <AsideInfoV2 data={animeInfo} />

          </>

        )}

      </div>
    </C.Container>
  )
}
