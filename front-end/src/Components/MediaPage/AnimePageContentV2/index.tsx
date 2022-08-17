import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as CheckSvg } from '../../../imgs/svg/check.svg'
import { ReactComponent as DotSvg } from '../../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../../imgs/svg/angle-right-solid.svg'
import { ReactComponent as EyeSvg } from '../../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../../imgs/svg//eye-slash-fill.svg'
import { ReactComponent as LoadingSvg } from '../../../imgs/svg/Spinner-1s-200px.svg'
import { ReactComponent as WarningSvg } from '../../../imgs/svg/exclamation-triangle.svg'
import SearchInnerPage from '../../SearchInnerPage'
import { addMediaToUserAccount, addToAlreadyWatched, removeFromAlreadyWatched, removeMediaFromUserAccount } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import gogoAnime from '../../../API/gogo-anime'
import Swal from 'sweetalert2'
import EpisodesGoGoAnime from '../../EpisodesGoGoAnime/EpisodesGoGoAnime'

export default function AnimePageContentV2(data: any) {

  const [moreDetails, setMoreDetails] = useState<boolean>(false)

  const [animeTitleWithoutSpace] = useState(data.data.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`))

  const [idGoGoAnime] = useState<String>(window.location.pathname.split('v2/')[1]) // id to be saved when user adds to bookmark or already watched

  const [videoReady, setVideoReady] = useState(false)
  const [loadingVideoplayer, setLoadingVideoplayer] = useState(false)
  const [videoURL, setVideoURL] = useState()

  const [videoId, setVideoId] = useState<String>()
  const [episodeChosed, setEpisodeChosed] = useState<String>()

  const [indexPageInfo, setIndexPageInfo] = useState(0)

  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

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

  //store current media url to redirect if user is not logged in
  const currentUrlToRedirect = window.location.pathname

  useEffect(() => {

    window.scrollTo(0, 0);

    //manages how much pages must be displayed to show all episodes 
    let howManyPages: number = 0;

    if (data.data.episodesList.length <= 24) {
      setHowManyPagesPagination(1);
    }

    let episodesLeft = data.data.episodesList.length;
    while (episodesLeft > 0) {
      episodesLeft = episodesLeft - 24;
      howManyPages = howManyPages + 1;
    }

    setHowManyPagesPagination(howManyPages - 1)

    //find if the current media was already added to user account
    if (userInfo) {
      userInfo.alreadyWatched.find((item: any) => {
        if (item.idGoGoAnime === idGoGoAnime) {
          setAlreadyWatched(true)
        }
      })
      userInfo.mediaAdded.find((item: any) => {
        if (item.idGoGoAnime === idGoGoAnime) {
          setIsAlreadyAdded(true)
        }
      })
    }

  }, [])

  const dispatch: any = useDispatch()
  const navigate: any = useNavigate()

  // add media to user
  const handleMediaToAccount = () => {

    //CHECKS if dont has on user account
    if (isAlreadyAdded == null || undefined) {

      if (userInfo) {

        dispatch(addMediaToUserAccount({
          'addedAt': new Date(),
          // 'idGoGoAnime': data.data.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`),
          'idGoGoAnime': idGoGoAnime ? idGoGoAnime : window.location.pathname.split('v2/')[1],
          'fullTitle': data.data.animeTitle,
          'nativeTitle': data.data.otherNames && data.data.otherNames,
          'coverImg': data.data.animeImg && data.data.animeImg,
          'type': data.data.type,
          'status': data.data.status,
          'totalEpisodes': data.data.episodesList.length,
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

        navigate(`/login?redirect=${currentUrlToRedirect.slice(1, currentUrlToRedirect.length)}`)

      }


    }
    else {

      //remove dispatch 
      dispatch(removeMediaFromUserAccount({

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

  // ADD, REMOVE FROM ALREADY WATCHED
  const handleAlreadyWatched = () => {

    //CHECKS if dont has on user account
    if (alreadyWatched == null || undefined) {

      if (userInfo) {

        dispatch(addToAlreadyWatched({
          'addedAt': new Date(),
          'updatedAt': new Date(),
          'idGoGoAnime': idGoGoAnime ? idGoGoAnime : window.location.pathname.split('v2/')[1],
          'fullTitle': data.data.animeTitle,
          'nativeTitle': data.data.otherNames && data.data.otherNames,
          'coverImg': data.data.animeImg && data.data.animeImg,
          'type': data.data.type,
          'status': data.data.status,
          'isAdult': Boolean(data.data.isAdult),
          'fromGoGoAnime': Boolean(true)
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

        'idGoGoAnime': data.data.animeTitle.replace(/!|#|/g, ``).replace(/%20/g, `-`),
        'fromGoGoAnime': Boolean(true)

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

  //gets the streaming url of chosed episode
  const getStreamingLink = async (id: String) => {

    setLoadingVideoplayer(true)
    setVideoReady(false)

    setVideoId(id)

    const data = await gogoAnime.getStreamingVideoUrlVIDCDN(id)

    setVideoURL(data.Referer)

    setLoadingVideoplayer(false)
    setVideoReady(true)

  }

  return (
    <C.Container
      data={data.data}
      indexHeading={indexPageInfo}
      isAlreadyAdded={isAlreadyAdded}
      alreadyWatched={alreadyWatched}
      videoReady={videoReady}
      videoId={videoId}
      loadingVideoplayer={loadingVideoplayer}
      darkMode={darkMode}
    >

      <div className='search-mobile'>
        <SearchInnerPage />
      </div>

      <div className='banner-img'>{
      }
      </div>

      <div className='name-and-description'>
        <div className='title-and-add-media-button'>

          <h1>{data.data.animeTitle}</h1>

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

        <div onClick={() => setMoreDetails(!moreDetails)}>
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
        </div>
      </div>

      <div className='heading' id='player-heading'>

        <div className='nav'>
          <h2 id='h2-0' onClick={() => setIndexPageInfo(0)}>
            Episode{episodeChosed ? ` ${episodeChosed}` : 's'}
          </h2>
        </div>

        <div className='svg-dots'>
          <DotSvg />
          <DotSvg />
        </div>
      </div>

      <div className='video'>

        {loadingVideoplayer && (
          <LoadingSvg />
        )}

        <iframe src={videoURL} title={data.data.animeTitle} allowFullScreen={true} frameBorder="0" marginWidth={0} marginHeight={0} scrolling="no">
        </iframe>
      </div>

      <div className='warning'>
        <span>
          <WarningSvg /><h1> Attention</h1>
        </span>
        <p>
          The video player being use to stream these episodes bellow is being shown as a pontential threat of data leaking by some antivirus.
        </p>
        <h2>Watch It By Your Own Risk.</h2>
      </div>

      {data.data.episodesList.length > 0 ? (
        <>

          {indexPageInfo === 0 && (
            <>
              <div className='anime-episodes' >

                {indexEpisodesPagination === 0 && (

                  data.data.episodesList.slice(0, 24).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 1 && (

                  data.data.episodesList.slice(24, 24 * 2).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 2 && (

                  data.data.episodesList.slice(24 * 2, 24 * 3).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 3 && (

                  data.data.episodesList.slice(24 * 3, 24 * 4).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 4 && (

                  data.data.episodesList.slice(24 * 4, 24 * 5).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 5 && (

                  data.data.episodesList.slice(24 * 5, 24 * 6).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 6 && (

                  data.data.episodesList.slice(24 * 6, 24 * 7).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 7 && (

                  data.data.episodesList.slice(24 * 7, 24 * 8).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 8 && (

                  data.data.episodesList.slice(24 * 8, 24 * 9).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 9 && (

                  data.data.episodesList.slice(24 * 9, 24 * 10).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 10 && (

                  data.data.episodesList.slice(24 * 10, 24 * 11).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 11 && (

                  data.data.episodesList.slice(24 * 11, 24 * 12).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 12 && (

                  data.data.episodesList.slice(24 * 12, 24 * 13).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 13 && (

                  data.data.episodesList.slice(24 * 13, 24 * 14).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 14 && (

                  data.data.episodesList.slice(24 * 14, 24 * 15).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 15 && (

                  data.data.episodesList.slice(24 * 15, 24 * 16).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 16 && (

                  data.data.episodesList.slice(24 * 16, 24 * 17).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 17 && (

                  data.data.episodesList.slice(24 * 17, 24 * 18).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 18 && (

                  data.data.episodesList.slice(24 * 18, 24 * 19).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 19 && (

                  data.data.episodesList.slice(24 * 19, 24 * 20).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 20 && (

                  data.data.episodesList.slice(24 * 20, 24 * 21).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 21 && (

                  data.data.episodesList.slice(24 * 21, 24 * 22).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 22 && (

                  data.data.episodesList.slice(24 * 22, 24 * 23).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 23 && (

                  data.data.episodesList.slice(24 * 23, 24 * 24).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 24 && (

                  data.data.episodesList.slice(24 * 24, 24 * 25).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 25 && (

                  data.data.episodesList.slice(24 * 25, 24 * 26).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 26 && (

                  data.data.episodesList.slice(24 * 26, 24 * 27).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 27 && (

                  data.data.episodesList.slice(24 * 27, 24 * 28).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 28 && (

                  data.data.episodesList.slice(24 * 28, 24 * 29).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 29 && (

                  data.data.episodesList.slice(24 * 29, 24 * 30).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 30 && (

                  data.data.episodesList.slice(24 * 30, 24 * 31).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 31 && (

                  data.data.episodesList.slice(24 * 31, 24 * 32).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 32 && (

                  data.data.episodesList.slice(24 * 32, 24 * 33).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 33 && (

                  data.data.episodesList.slice(24 * 33, 24 * 34).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 34 && (

                  data.data.episodesList.slice(24 * 34, 24 * 35).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 35 && (

                  data.data.episodesList.slice(24 * 35, 24 * 36).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 36 && (

                  data.data.episodesList.slice(24 * 36, 24 * 37).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 37 && (

                  data.data.episodesList.slice(24 * 37, 24 * 38).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 38 && (

                  data.data.episodesList.slice(24 * 38, 24 * 39).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 39 && (

                  data.data.episodesList.slice(24 * 39, 24 * 40).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 40 && (

                  data.data.episodesList.slice(24 * 40, 24 * 41).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 41 && (

                  data.data.episodesList.slice(24 * 41, 24 * 42).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 42 && (

                  data.data.episodesList.slice(24 * 42, 24 * 43).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 43 && (

                  data.data.episodesList.slice(24 * 43, 24 * 44).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 44 && (

                  data.data.episodesList.slice(24 * 44, 24 * 45).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 45 && (

                  data.data.episodesList.slice(24 * 45, 24 * 46).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 46 && (

                  data.data.episodesList.slice(24 * 46, 24 * 47).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}
                {indexEpisodesPagination === 47 && (

                  data.data.episodesList.slice(24 * 47, 24 * 48).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 48 && (

                  data.data.episodesList.slice(24 * 48, 24 * 49).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
                  ))

                )}

                {indexEpisodesPagination === 49 && (

                  data.data.episodesList.slice(24 * 49, 24 * 50).map((item: any, key: any) => (
                    <a href='#player-heading'
                      key={item.episodeId}
                      onClick={() => setEpisodeChosed(item.episodeNum)}
                    >
                      <EpisodesGoGoAnime
                        data={item}
                        media={data.data}
                        mediaTitle={animeTitleWithoutSpace}
                        streamingLink={(episodeId: any) => getStreamingLink(episodeId)}
                      />
                    </a>
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
