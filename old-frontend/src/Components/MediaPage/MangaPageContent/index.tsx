import React, { useEffect, useState } from 'react'
import * as C from './styles'
import ReactHtmlParser from 'react-html-parser'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { ReactComponent as EyeSvg } from '../../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../../imgs/svg//eye-slash-fill.svg'
import SearchInnerPage from '../../SearchInnerPage'
import { useNavigate } from 'react-router-dom'
import { addMediaToUserAccount, addToAlreadyWatched, removeFromAlreadyWatched, removeMediaFromUserAccount } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import FromSameFranchise from '../FromSameFranchise'
import AnimeRecommendations from '../AnimeRecommendations'

export default function MangaPageContent(data: any) {

  const [isAlreadyAdded, setIsAlreadyAdded] = useState<any>()
  const [alreadyWatched, setAlreadyWatched] = useState<any>()

  // state
  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin

  // dark mode
  const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
  const { darkMode } = darkModeSwitch

  const addMediaToUserAccounts = useSelector((state: any) => state.addMediaToUserAccount)
  const removeMediaFromUserAccounts = useSelector((state: any) => state.removeMediaFromUserAccount)
  const addLoading = addMediaToUserAccounts.loading
  const addError = addMediaToUserAccounts.error
  const remLoading = removeMediaFromUserAccounts.loading
  const remError = removeMediaFromUserAccounts.error

  useEffect(() => {

    window.scrollTo(0, 0);

    //find if the current media was already added to user account
    if (userInfo) {
      userInfo.alreadyWatched.find((item: any) => {
        if (item.id === data.data.id) {
          setAlreadyWatched(true)
        }
      })
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

  //store current media url to redirect if user is not logged in
  const currentUrlToRedirect = window.location.pathname

  const handleMediaToAccount = () => {

    //CHECKS if dont has on user account
    if (isAlreadyAdded == null || undefined) {

      if (userInfo) {

        dispatch(addMediaToUserAccount({
          'addedAt': new Date(),
          'id': Number(data.data.id),
          'primaryColor': data.data.coverImage.color ? data.data.coverImage.color : '',
          'fullTitle': data.data.title.romaji,
          'nativeTitle': data.data.title.native,
          'bannerImg': data.data.bannerImage ? data.data.bannerImage : '',
          'coverImg': data.data.coverImage.large ? data.data.coverImage.large : data.data.coverImage.extraLarge || data.data.coverImage.medium,
          'format': data.data.format,
          'type': data.data.type,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult)
        }))

        setIsAlreadyAdded(true)

        if (!addLoading && !addError) {
          Swal.fire({
            icon: "success",
            title: 'Added To Bookmarks!',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 7000,
            timerProgressBar: true,
          })
        }

      }
      else {

        navigate(`/login?redirect=${currentUrlToRedirect.slice(1, currentUrlToRedirect.length)}`)

      }


    }
    else {

      //remove dispatch 
      dispatch(removeMediaFromUserAccount({

        'id': Number(data.data.id)

      }))

      setIsAlreadyAdded(null)

      if (!remLoading && !remError) {
        Swal.fire({
          icon: "success",
          title: 'Removed From Bookmarks!',
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 7000,
          timerProgressBar: true,
        })
      }

    }

  }

  // ADD, REMOVE FROM ALREADY WATCHED
  const handleAlreadyWatched = () => {

    //CHECKS if dont has on user account
    if (alreadyWatched == null || undefined) {

      if (userInfo) {

        dispatch(addToAlreadyWatched({
          'addedAt': new Date(),
          'updatedAt': new Date(),
          'id': Number(data.data.id),
          'primaryColor': data.data.coverImage.color ? data.data.coverImage.color : '',
          'fullTitle': data.data.title.romaji,
          'nativeTitle': data.data.title.native,
          'bannerImg': data.data.bannerImage ? data.data.bannerImage : '',
          'coverImg': data.data.coverImage.large ? data.data.coverImage.large : data.data.coverImage.extraLarge || data.data.coverImage.medium,
          'format': data.data.format,
          'type': data.data.type,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult)
        }))

        setAlreadyWatched(true)

        if (!addLoading && !addError) {
          Swal.fire({
            icon: "success",
            title: 'Added To Bookmarks!',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 7000,
            timerProgressBar: true,
          })
        }

      }
      else {

        navigate(`/login?redirect=${currentUrlToRedirect.slice(1, currentUrlToRedirect.length)}`)

      }


    }
    else {

      //remove dispatch 
      dispatch(removeFromAlreadyWatched({

        'id': Number(data.data.id),
        'fromGoGoAnime': Boolean(false)

      }))

      setAlreadyWatched(null)

      if (!remLoading && !remError) {
        Swal.fire({
          icon: "success",
          title: 'Removed From Bookmarks!',
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 7000,
          timerProgressBar: true,
        })
      }

    }

  }

  return (
    <C.Container
      data={data.data}
      isAlreadyAdded={isAlreadyAdded}
      alreadyWatched={alreadyWatched}
      darkMode={darkMode}
    >

      <div className='search-mobile'>
        <SearchInnerPage />
      </div>

      <div className='banner-img'>
      </div>

      <div className='name-and-description'>
        <div className='title-and-add-media-button'>

          <h1>{data.data.title.romaji}</h1>

          <div className='buttons'>
            {alreadyWatched == null && (
              <button onClick={() => handleAlreadyWatched()} className='watched'><EyeSlashSvg />  Not Read</button>
            )}

            {alreadyWatched && (
              <button onClick={() => handleAlreadyWatched()} className='watched'><EyeSvg />  Read</button>
            )}

            {isAlreadyAdded == null && (
              <button onClick={() => handleMediaToAccount()} className='bookmarked'><PlusSvg /> Add To Bookmarks</button>
            )}

            {isAlreadyAdded && (
              <button onClick={() => handleMediaToAccount()} className='bookmarked'><CheckSvg /> Added on Bookmarks</button>
            )}
          </div>

        </div>

        <div className='description'>{ReactHtmlParser(data.data.description)}</div>

      </div>

      {/* medias related to this anime */}
      {
        data.data.relations.nodes.length > 0 && (
          <FromSameFranchise data={data.data.relations.nodes} />
        )
      }

      {/* recommendations based on this anime */}
      {
        data.data.recommendations.edges.length > 0 && (

          <AnimeRecommendations titleName={data.data.title.romaji} data={data.data.recommendations.edges} />
        )
      }

    </C.Container >
  )
}
