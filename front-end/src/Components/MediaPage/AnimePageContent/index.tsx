import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import { ReactComponent as EyeSvg } from '../../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../../imgs/svg//eye-slash-fill.svg'
import SearchInnerPage from '../../SearchInnerPage'
import CharacterAndActor from '../CharacterAndActor'
import { addMediaToUserAccount, addToAlreadyWatched, removeFromAlreadyWatched, removeMediaFromUserAccount } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import AnimeRecommendations from '../AnimeRecommendations'
import FromSameFranchise from '../FromSameFranchise'
import CrunchyrollEpisodesGrid from '../CrunchyrollEpisodesGrid'

export default function AnimePageContent(data: any) {

  const [mainCastCharacters, setMainCastCharacters] = useState([])
  const [supportingCastCharacters, setSupportingCastCharacters] = useState([])

  //media description toggle more/less info
  const [moreDetails, setMoreDetails] = useState<boolean>(false)

  const [indexPageInfo, setIndexPageInfo] = useState(0) //tab aux index

  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

  const [alreadyWatched, setAlreadyWatched] = useState<any>()
  const [isAlreadyAdded, setIsAlreadyAdded] = useState<any>()

  //state
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

    let howManyPages: number = 0;

    if (data.data.streamingEpisodes.length <= 24) {
      setHowManyPagesPagination(1);
    }

    let episodesLeft = data.data.streamingEpisodes.length;
    while (episodesLeft > 0) {
      episodesLeft = episodesLeft - 24;
      howManyPages = howManyPages + 1;
    }

    setHowManyPagesPagination(howManyPages - 1)

    //filter MAIN and SUPPORTING characters
    if (data.data.characters.edges.length > 0) {
      const mainChar = data.data.characters.edges.filter((item: any) => {
        return item.role === 'MAIN'
      })
      setMainCastCharacters(mainChar)

      const supChar = data.data.characters.edges.filter((item: any) => {
        return item.role === 'SUPPORTING'
      })
      setSupportingCastCharacters(supChar)
    }

    //check if the current media is bookmarked or watched
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

  }, [])

  //store current media url to redirect if user is not logged in
  const currentUrlToRedirect = window.location.pathname

  const dispatch: any = useDispatch()
  const navigate: any = useNavigate()

  const handleAlreadyWatched = () => {

    //CHECKS if this media was not watched yet
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
          'coverImg': data.data.coverImage.large || data.data.coverImage.extraLarge || data.data.coverImage.medium,
          'format': data.data.format,
          'type': data.data.type,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult),
          'fromGoGoAnime': Boolean(false)
        }))

        setAlreadyWatched(true)

        //handle errors with Adding Function
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

  const handleMediaToAccount = () => {

    //CHECKS if this media was not added on user account
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
          'totalEpisodes': data.data.streamingEpisodes.length,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult),
          'fromGoGoAnime': Boolean(false)
        }))

        setIsAlreadyAdded(true)

        //handle errors with Adding Function
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

      {/* div to hold the banner img as background image */}
      <div className='banner-img'></div>

      <div className='name-and-description'>

        <div className='title-and-add-media-button'>

          <h1>{data.data.title.romaji}</h1>

          <div className='buttons'>

            {alreadyWatched == null && (
              <button onClick={() => handleAlreadyWatched()} className='watched'>
                <EyeSlashSvg />  Not Watched</button>
            )}

            {alreadyWatched && (
              <button onClick={() => handleAlreadyWatched()} className='watched'>
                <EyeSvg />  Watched</button>
            )}

            {isAlreadyAdded == null && (
              <button onClick={() => handleMediaToAccount()} className='bookmarked'>
                <PlusSvg /> Add To Bookmarks
              </button>
            )}

            {isAlreadyAdded && (
              <button onClick={() => handleMediaToAccount()} className='bookmarked'>
                <CheckSvg /> Added on Bookmarks
              </button>
            )}

          </div>

        </div>

        <div className='description' onClick={() => setMoreDetails(!moreDetails)}>
          {data.data.description.length >= 420 ? (
            moreDetails === false ? (
              <>
                {ReactHtmlParser(data.data.description.slice(0, 420))}
                <span onClick={() => setMoreDetails(!moreDetails)}> ...more details.</span>
              </>
            ) : (
              <>
                {ReactHtmlParser(data.data.description)}
                <span onClick={() => setMoreDetails(!moreDetails)}> ...less details.</span>
              </>
            )
          ) : (
            <>
              {ReactHtmlParser(data.data.description)}
            </>
          )}
        </div>
      </div>

      {/* tab buttons */}
      <div className='heading'>

        <div className='nav'>
          <h2 id='h2-0' onClick={() => setIndexPageInfo(0)}>Episodes</h2>
          <h2 id='h2-1' onClick={() => setIndexPageInfo(1)}>Cast</h2>
          <h2 id='h2-2' onClick={() => setIndexPageInfo(2)}>More Info</h2>
        </div>

        <div className='svg-dots'>
          <DotSvg />
          <DotSvg />
        </div>
      </div>


      {/* show episodes listed to this anime, redirecting to crunchroll */}
      {
        data.data.streamingEpisodes.length > 0 ? (
          <>

            {indexPageInfo === 0 && (
              <>
                <div className='anime-episodes' >

                  {/* Shows Episodes Available to Watch */}
                  <CrunchyrollEpisodesGrid
                    indexEpisodesPagination={indexEpisodesPagination}
                    data={data.data.streamingEpisodes} />

                </div>

                {data.data.streamingEpisodes.length > 24 && (
                  <div className='pagination-buttons'>
                    <button type='button'
                      disabled={indexEpisodesPagination === 0 ? true : false}
                      onClick={() => {
                        if (indexEpisodesPagination === 0) {
                          setIndexEpisodePagination(0)
                        } else {
                          setIndexEpisodePagination(indexEpisodesPagination - 1)
                        }
                      }}>
                      <AngleLeftSolidSvg />
                    </button>

                    <span>
                      {indexEpisodesPagination + 1}
                    </span>

                    <button type='button'
                      disabled={indexEpisodesPagination === howManyPagesPagination ? true : false}
                      onClick={() => {
                        if (indexEpisodesPagination === howManyPagesPagination) {
                          setIndexEpisodePagination(0)
                        } else {
                          setIndexEpisodePagination(indexEpisodesPagination + 1)
                        }
                      }}>
                      <AngleRightSolidSvg />
                    </button>
                  </div>
                )}
              </>
            )}

            {indexPageInfo === 1 && (
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

            {indexPageInfo === 2 && (
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
          </>
        ) : (
          <>
            <div className='heading'>

              {indexPageInfo === 0 && (
                <h2>Theres no Episodes to Display Here!</h2>
              )}


            </div>
            {indexPageInfo === 1 && (
              <div className='cast'>
                {data.data.characters.edges.length > 0 ? (
                  <>
                    <h1>Main Cast</h1>

                    {mainCastCharacters.map((item: any, key: any) => (
                      <CharacterAndActor data={item} key={key} />
                    ))}

                    <h1>Supporting Cast</h1>

                    {supportingCastCharacters.map((item: any, key: any) => (
                      <CharacterAndActor data={item} key={key} />
                    ))}
                  </>
                ) : (
                  <h2>Theres no info about the cast.</h2>
                )}
              </div>
            )}

            {indexPageInfo === 2 && (
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
          </>
        )
      }

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
