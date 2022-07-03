import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import AnimesReleasingThisWeek from '../../Home/AnimesReleasingThisWeekList'
import SearchInnerPage from '../../SearchInnerPage'
import CharacterAndActor from '../../CharacterAndActor'
import { addMediaToUserAccount, removeMediaFromUserAccount } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import gogoAnime from '../../../API/gogo-anime'
import Swal from 'sweetalert2'

export default function AnimePageContentV2(data: any) {

  const [moreDetails, setMoreDetails] = useState<boolean>(false)

  const [animeTitleWithoutSpace, setAnimeTitleWithoutSpace] = useState(data.data.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`))

  const [videoReady, setVideoReady] = useState(false)
  const [videoURL, setVideoURL] = useState()

  const [indexPageInfo, setIndexPageInfo] = useState(0)

  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

  const [exitFullScreen, setExitFullScreen] = useState<boolean>(false) //when video url is fetch, this set fullscreen to player  

  const [isAlreadyAdded, setIsAlreadyAdded] = useState<any>()

  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin
  const addMediaToUserAccounts = useSelector((state: any) => state.addMediaToUserAccount)
  const removeMediaFromUserAccounts = useSelector((state: any) => state.removeMediaFromUserAccount)
  const addLoading = addMediaToUserAccounts.loading
  const addError = addMediaToUserAccounts.error
  const remLoading = removeMediaFromUserAccounts.loading
  const remError = removeMediaFromUserAccounts.error

  useEffect(() => {

    window.scrollTo(0, 0);

    let howManyPages: number = 0;
    let howMuchEpisodes: number = data.data.episodesList.length;

    if (data.data.episodesList.length <= 24) {
      setHowManyPagesPagination(1);
    }

    let episodesLeft = data.data.episodesList.length;
    while (episodesLeft > 0) {
      episodesLeft = episodesLeft - 24;
      howManyPages = howManyPages + 1;
      howMuchEpisodes = episodesLeft;
    }

    setHowManyPagesPagination(howManyPages - 1)

    //find if the current media was already added to user account
    if (userInfo) {
      userInfo.mediaAdded.find((item: any) => {
        if (item.idGoGoAnime === data.data.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`)) {
          setIsAlreadyAdded(true)
        }
      })
    }

  }, [data.data.episodesList[0].length])

  // add media to user
  const dispatch: any = useDispatch()
  const navigate: any = useNavigate()
  const handleMediaToAccount = () => {

    //CHECKS if dont has on user account
    if (isAlreadyAdded == null || undefined) {

      if (userInfo) {

        dispatch(addMediaToUserAccount(userInfo.id, {
          'addedAt': new Date(),
          'idGoGoAnime': data.data.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`),
          'fullTitle': data.data.animeTitle,
          'nativeTitle': data.data.otherNames && data.data.otherNames,
          'coverImg': data.data.animeImg && data.data.animeImg,
          'type': data.data.type,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult),
          'fromGoGoAnime': Boolean(true)
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

        navigate('/login')

      }


    }
    else {

      //remove dispatch 
      dispatch(removeMediaFromUserAccount(userInfo.id, {

        'idGoGoAnime': data.data.animeTitle.replace(/!|#|/g, ``).replace(/%20/g, `-`)

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

  //if theres a error, it shows what happen
  if (addError || remError) {

    switch (addError || remError) {
      case 403:
        Swal.fire({

          icon: 'info',
          title: 'Error',
          titleText: `${addError || remError}: Before Doing It!`,
          text: 'We need you to activy what makes our DataBase works. Enter on The Link below and Try Again!',
          allowOutsideClick: false,
          footer: 'https://cors-anywhere.herokuapp.com/'
        })
        break
      default:
        Swal.fire({

          icon: 'error',
          title: 'Error',
          titleText: `${addError || remError}: Something Happen!`,
          text: "We Don't Know What Happen. But Try Again!"

        })
        break
    }


  }

  //gets the streaming url of choose episode
  const getStreamingLink = async (id: String) => {

    setVideoReady(false)

    const data = await gogoAnime.getStreamingVideoUrlVIDCDN(id)

    // setVideoURL(data.sources[0].file)
    setVideoURL(data.Referer)

    setVideoReady(true)

    setExitFullScreen(true)

  }

  //NEEDS FIX: TRIES to make video player stay on full screen
  const handleFullScreen = (decision: boolean) => {

    switch (decision) {

      case true:
        setExitFullScreen(!exitFullScreen)
        break

      case false:
        setVideoReady(false)
        setVideoURL(undefined)
        break
    }

  }

  return (
    <C.Container
      data={data.data}
      indexHeading={indexPageInfo}
      isAlreadyAdded={isAlreadyAdded}
      videoReady={videoReady}
      exitFullScreen={exitFullScreen}
    >

      <div className='search-mobile'>
        <SearchInnerPage />
      </div>

      <div className='banner-img'>{

        /* <img src={`${data.data.bannerImage}`} alt={`${data.data.title.romaji} Cover Art`} /> */
      }
      </div>

      <div className='name-and-description'>
        <div className='title-and-add-media-button'>

          <h1>{data.data.animeTitle}</h1>

          {isAlreadyAdded == null && (
            <button onClick={() => handleMediaToAccount()}><PlusSvg /> Add To Bookmarks</button>
          )}

          {isAlreadyAdded && (
            <button onClick={() => handleMediaToAccount()}><CheckSvg /> Added on Bookmarks</button>
          )}

        </div>

        <p>
          {data.data.synopsis.length >= 420 ? (
            moreDetails === false ? (
              <p>
                {data.data.synopsis.slice(0, 420)}
                <span onClick={() => setMoreDetails(!moreDetails)}> ...more details.</span>
              </p>
            ) : (
              <p>
                {data.data.synopsis}
                <span onClick={() => setMoreDetails(!moreDetails)}> less details.</span>
              </p>
            )
          ) : (
            <p>{data.data.synopsis}</p>
          )}
        </p>
      </div>

      <div className='heading'>

        <div className='nav'>
          <h2 id='h2-0' onClick={() => setIndexPageInfo(0)}>Episodes</h2>
        </div>

        <div className='svg-dots'>
          <DotSvg />
          <DotSvg />
        </div>
      </div>

      <div className='video'>

        <p>Put the Mouse Indicator Away from The Window, or from the Video Player.</p>

        <div className='buttons'>
          <button type='button' onClick={() => handleFullScreen(false)}>Close Video Player</button>
          <button type='button' onClick={() => handleFullScreen(true)}>Video on FullScreen</button>
        </div>

        <iframe src={videoURL} title={data.data.animeTitle}>
        </iframe>

      </div>


      {data.data.episodesList.length > 0 ? (
        <>

          {indexPageInfo === 0 && (
            <>
              <div className='anime-episodes' >

                {indexEpisodesPagination === 0 && (

                  data.data.episodesList.slice(0, 24).map((item: any, key: any) => (
                    <div key={key} className='episode'>
                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 1 && (

                  data.data.episodesList.slice(24, 24 * 2).map((item: any, key: any) => (
                    <div key={key} className='episode'>
                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 2 && (

                  data.data.episodesList.slice(24 * 2, 24 * 3).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 3 && (

                  data.data.episodesList.slice(24 * 3, 24 * 4).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 4 && (

                  data.data.episodesList.slice(24 * 4, 24 * 5).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 5 && (

                  data.data.episodesList.slice(24 * 5, 24 * 6).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 6 && (

                  data.data.episodesList.slice(24 * 6, 24 * 7).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 7 && (

                  data.data.episodesList.slice(24 * 7, 24 * 8).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 8 && (

                  data.data.episodesList.slice(24 * 8, 24 * 9).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 9 && (

                  data.data.episodesList.slice(24 * 9, 24 * 10).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 10 && (

                  data.data.episodesList.slice(24 * 10, 24 * 11).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 11 && (

                  data.data.episodesList.slice(24 * 11, 24 * 12).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 12 && (

                  data.data.episodesList.slice(24 * 12, 24 * 13).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 13 && (

                  data.data.episodesList.slice(24 * 13, 24 * 14).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 14 && (

                  data.data.episodesList.slice(24 * 14, 24 * 15).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 15 && (

                  data.data.episodesList.slice(24 * 15, 24 * 16).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 16 && (

                  data.data.episodesList.slice(24 * 16, 24 * 17).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 17 && (

                  data.data.episodesList.slice(24 * 17, 24 * 18).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 18 && (

                  data.data.episodesList.slice(24 * 18, 24 * 19).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 19 && (

                  data.data.episodesList.slice(24 * 19, 24 * 20).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 20 && (

                  data.data.episodesList.slice(24 * 20, 24 * 21).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 21 && (

                  data.data.episodesList.slice(24 * 21, 24 * 22).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 22 && (

                  data.data.episodesList.slice(24 * 22, 24 * 23).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 23 && (

                  data.data.episodesList.slice(24 * 23, 24 * 24).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 24 && (

                  data.data.episodesList.slice(24 * 24, 24 * 25).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 25 && (

                  data.data.episodesList.slice(24 * 25, 24 * 26).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 26 && (

                  data.data.episodesList.slice(24 * 26, 24 * 27).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 27 && (

                  data.data.episodesList.slice(24 * 27, 24 * 28).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 28 && (

                  data.data.episodesList.slice(24 * 28, 24 * 29).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 29 && (

                  data.data.episodesList.slice(24 * 29, 24 * 30).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 30 && (

                  data.data.episodesList.slice(24 * 30, 24 * 31).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 31 && (

                  data.data.episodesList.slice(24 * 31, 24 * 32).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 32 && (

                  data.data.episodesList.slice(24 * 32, 24 * 33).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 33 && (

                  data.data.episodesList.slice(24 * 33, 24 * 34).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 34 && (

                  data.data.episodesList.slice(24 * 34, 24 * 35).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 35 && (

                  data.data.episodesList.slice(24 * 35, 24 * 36).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 36 && (

                  data.data.episodesList.slice(24 * 36, 24 * 37).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 37 && (

                  data.data.episodesList.slice(24 * 37, 24 * 38).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 38 && (

                  data.data.episodesList.slice(24 * 38, 24 * 39).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 39 && (

                  data.data.episodesList.slice(24 * 39, 24 * 40).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 40 && (

                  data.data.episodesList.slice(24 * 40, 24 * 41).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 41 && (

                  data.data.episodesList.slice(24 * 41, 24 * 42).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 42 && (

                  data.data.episodesList.slice(24 * 42, 24 * 43).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 43 && (

                  data.data.episodesList.slice(24 * 43, 24 * 44).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 44 && (

                  data.data.episodesList.slice(24 * 44, 24 * 45).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 45 && (

                  data.data.episodesList.slice(24 * 45, 24 * 46).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 46 && (

                  data.data.episodesList.slice(24 * 46, 24 * 47).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}
                {indexEpisodesPagination === 47 && (

                  data.data.episodesList.slice(24 * 47, 24 * 48).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 48 && (

                  data.data.episodesList.slice(24 * 48, 24 * 49).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

                {indexEpisodesPagination === 49 && (

                  data.data.episodesList.slice(24 * 49, 24 * 50).map((item: any, key: any) => (
                    <div key={key} className='episode'>

                      <button onClick={() => getStreamingLink(item.episodeId)}>
                        <h3>Episode {item.episodeNum}</h3>
                      </button>
                    </div>
                  ))

                )}

              </div>

              {data.data.episodesList.length > 24 && (
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

        </>
      ) : (
        <>
          <div className='heading'>

            {indexPageInfo === 0 && (
              <h2>Theres no Episodes to Display Here!</h2>
            )}

          </div>

        </>
      )}

    </C.Container >
  )
}
