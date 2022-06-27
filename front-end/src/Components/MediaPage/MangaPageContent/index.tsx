import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import AnimesReleasingThisWeek from '../../Home/AnimesReleasingThisWeekList'
import SearchInnerPage from '../../SearchInnerPage'
import { Link, useNavigate } from 'react-router-dom'
import { addMediaToUserAccount, removeMediaFromUserAccount } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

export default function MangaPageContent(data: any) {

  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

  const [isAlreadyAdded, setIsAlreadyAdded] = useState<any>()

  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin

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

    //find if the current media was already added to user account
    if (userInfo) {
      userInfo.mediaAdded.find((item: any) => {
        if (item.id === data.data.id) {
          setIsAlreadyAdded(true)
        }
      })
    }

  }, [data.data.streamingEpisodes.length])

  // add media to user
  const dispatch: any = useDispatch()
  const navigate: any = useNavigate()

  const handleMediaToAccount = () => {

    //CHECKS if dont has on user account
    if (isAlreadyAdded == null || undefined) {

      if (userInfo) {

        dispatch(addMediaToUserAccount(userInfo.id, {
          'addedAt': new Date(),
          'id': Number(data.data.id),
          'fullTitle': data.data.title.romaji,
          'nativeTitle': data.data.title.native,
          'format': data.data.format,
          'type': data.data.type,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult)
        }))

        setIsAlreadyAdded(true)

      }
      else {

        navigate('/login')

      }


    }
    else {

      //remove dispatch 
      dispatch(removeMediaFromUserAccount(userInfo.id, {

        'id': Number(data.data.id)

      }))

      setIsAlreadyAdded(null)


    }

  }

  return (
    <C.Container data={data.data} isAlreadyAdded={isAlreadyAdded}>

      <div className='search-mobile'>
        <SearchInnerPage />
      </div>

      <div className='banner-img'>
        {
          /* <img src={`${data.data.bannerImage}`} alt={`${data.data.title.romaji} Cover Art`} /> */
        }
      </div>

      <div className='name-and-description'>
        <div className='title-and-add-media-button'>

          <h1>{data.data.title.romaji}</h1>

          {isAlreadyAdded == null && (
            <button onClick={() => handleMediaToAccount()}><PlusSvg /> Add To Bookmarks</button>
          )}

          {isAlreadyAdded && (
            <button onClick={() => handleMediaToAccount()}><CheckSvg /> Added on Bookmarks</button>
          )}

        </div>

        <p>{data.data.description}</p>

      </div>

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
