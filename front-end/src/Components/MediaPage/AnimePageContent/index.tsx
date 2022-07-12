import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
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
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'

export default function AnimePageContent(data: any) {

  const [mainCastCharacters, setMainCastCharacters] = useState([])
  const [supportingCastCharacters, setSupportingCastCharacters] = useState([])

  const [moreDetails, setMoreDetails] = useState<boolean>(false)

  const [indexPageInfo, setIndexPageInfo] = useState(0)

  const [indexEpisodesPagination, setIndexEpisodePagination] = useState<number>(0)
  const [howManyPagesPagination, setHowManyPagesPagination] = useState<number>(0)

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

    //check if the current media is currently added to user account
    if (userInfo) {
      userInfo.mediaAdded.find((item: any) => {
        if (item.id === data.data.id) {
          setIsAlreadyAdded(true)
        }
      })
    }


  }, [data.data.characters.edges, data.data.streamingEpisodes.length])

  //store current media url to redirect if user is not logged in
  const currentUrlToRedirect = window.location.pathname

  const dispatch: any = useDispatch()
  const navigate: any = useNavigate()

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
          'isAdult': Boolean(data.data.isAdult),
          'fromGoGoAnime': Boolean(false)
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

        navigate(`/login?redirect=${currentUrlToRedirect.slice(1,currentUrlToRedirect.length)}`)

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

  return (
    <C.Container data={data.data} indexHeading={indexPageInfo} isAlreadyAdded={isAlreadyAdded}>

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

      {
        data.data.streamingEpisodes.length > 0 ? (
          <>

            {indexPageInfo === 0 && (
              <>
                <div className='anime-episodes' >

                  {indexEpisodesPagination === 0 && (

                    data.data.streamingEpisodes.slice(0, 24).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}

                  {indexEpisodesPagination === 1 && (

                    data.data.streamingEpisodes.slice(24, 24 * 2).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}
                  {indexEpisodesPagination === 2 && (

                    data.data.streamingEpisodes.slice(24 * 2, 24 * 3).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}
                  {indexEpisodesPagination === 3 && (

                    data.data.streamingEpisodes.slice(24 * 3, 24 * 4).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}
                  {indexEpisodesPagination === 4 && (

                    data.data.streamingEpisodes.slice(24 * 4, 24 * 5).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}
                  {indexEpisodesPagination === 5 && (

                    data.data.streamingEpisodes.slice(24 * 5, 24 * 6).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}
                  {indexEpisodesPagination === 6 && (

                    data.data.streamingEpisodes.slice(24 * 6, 24 * 7).map((item: any, key: any) => (
                      <div key={key} className='episode'>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <img src={`${item.thumbnail}`} alt={`${item.title}`}></img>
                        </a>
                        <a href={`${item.url}`} target='_blank' rel='noreferrer'>
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    ))

                  )}

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
                        <li>{item.name}</li>
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

      {
        data.data.relations.nodes.length > 0 && (
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
        )
      }

      {
        data.data.recommendations.edges.length > 0 && (
          <div className='similar-animes'>
            <h2>Similar to <span>{data.data.title.romaji}</span></h2>

            <ul>
              {data.data.recommendations.edges.slice(0, 8).map((item: any, key: any) => (
                <li><AnimesReleasingThisWeek key={key} data={item.node.mediaRecommendation} /></li>
              ))}
            </ul>
          </div>
        )
      }

    </C.Container >
  )
}
