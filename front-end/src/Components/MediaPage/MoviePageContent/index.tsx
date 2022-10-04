import React, { useEffect, useState } from 'react'
import * as C from './styles'
import ReactHtmlParser from 'react-html-parser'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as EyeSvg } from '../../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../../imgs/svg//eye-slash-fill.svg'
import SearchInnerPage from '../../SearchInnerPage'
import { Link, useNavigate } from 'react-router-dom'
import CharacterAndActor from '../CharacterAndActor'
import { useDispatch, useSelector } from 'react-redux'
import { addMediaToUserAccount, addToAlreadyWatched, removeFromAlreadyWatched, removeMediaFromUserAccount } from '../../../redux/actions/userActions'
import Swal from 'sweetalert2'
import FromSameFranchise from '../FromSameFranchise'
import AnimeRecommendations from '../AnimeRecommendations'

export default function MoviePageContent(data: any) {

  const [indexPageInfo, setIndexPageInfo] = useState(0)

  const [mainCastCharacters, setMainCastCharacters] = useState([])
  const [supportingCastCharacters, setSupportingCastCharacters] = useState([])

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

    //gets the main and support characters
    const mainChar = data.data.characters.edges.filter((item: any) => {
      return item.role === 'MAIN'
    })
    setMainCastCharacters(mainChar)

    const supChar = data.data.characters.edges.filter((item: any) => {
      return item.role === 'SUPPORTING'
    })
    setSupportingCastCharacters(supChar)

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
      indexHeading={indexPageInfo}
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
              <button onClick={() => handleAlreadyWatched()} className='watched'><EyeSlashSvg />  Not Watched</button>
            )}

            {alreadyWatched && (
              <button onClick={() => handleAlreadyWatched()} className='watched'><EyeSvg />  Watched</button>
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

      <div className='heading'>

        <div className='nav'>
          <h2 data-tab="0" onClick={() => setIndexPageInfo(0)}>Cast</h2>
          <h2 data-tab="1" onClick={() => setIndexPageInfo(1)}>More Info</h2>
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


          <h1>Supporting Cast</h1>

          {supportingCastCharacters.map((item: any, key: any) => (
            <CharacterAndActor data={item} key={key} />
          ))}
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
                  <li><Link to={`/genre/${item.name}`}>{item.name}</Link></li>
                ))}
              </ul>
            </li>

          )}
        </ul>
      )}

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
