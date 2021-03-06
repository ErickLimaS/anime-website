import * as C from './styles'
import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import Swal from 'sweetalert2'
import { logoutUser } from '../../../redux/actions/userActions'


export default function BookmarkUser() {

    const [loading, setLoading] = useState(true)

    const [allTypes, setAllTypes] = useState<any>()
    const [animesTypeItems, setAnimesTypeItems] = useState<any>()
    const [mangasTypeItems, setMangasTypeItems] = useState<any>()
    const [moviesTypeItems, setMoviesTypeItems] = useState<any>()
    const [otherTypeItems, setOtherTypeItems] = useState<any>()

    const [tabIndex, setTabIndex] = useState<number>(0)

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const navigate = useNavigate()
    const dispatch: any = useDispatch()

    //store current media url to redirect if user is not logged in
    const redirect = window.location.pathname ? `${window.location.pathname}` : ''

    useEffect(() => {

        document.title = 'Loading... | AniProject'

        setLoading(true)

        if (!userInfo || !userLogin) {

            navigate('/')

        }

        //request all media added from users account
        const load = async () => {

            try {

                const data: any = await Axios({
                    url: `https://cors-anywhere.herokuapp.com/https://animes-website-db.herokuapp.com/users/media`,
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                })
                setAllTypes(data.data.mediaAdded)

                const animesType = data.data.mediaAdded.filter((item: any) => {
                    return item.type === "ANIME" && item.format !== "MOVIE"
                })
                setAnimesTypeItems(animesType)
                console.log('then')

                const mangasType = data.data.mediaAdded.filter((item: any) => {
                    return item.type === "MANGA"
                })

                setMangasTypeItems(mangasType)
                const moviesType = data.data.mediaAdded.filter((item: any) => {
                    return item.format === "MOVIE"
                })

                setMoviesTypeItems(moviesType)
                const otherType = data.data.mediaAdded.filter((item: any) => {
                    return item.type !== "MANGA" && item.type !== "ANIME"
                })
                setOtherTypeItems(otherType)
            }
            catch (error: any) {
                //TOKEN VALIDATION/EXPIRATION
                Swal.fire({
                    icon: 'warning',
                    title: 'Security First!',
                    titleText: `${error.response.status}: Security First!`,
                    text: 'You Will Need To Login Again So We Will Make Your Account Secure!',
                    allowOutsideClick: false,
                    didClose: () => {

                        dispatch(logoutUser())
                        window.location.href = redirect !== '' ? `/login?redirect=${redirect.slice(1, redirect.length)}` : '/login'

                    }
                })

            }

        }
        load()

        setLoading(false)

        document.title = 'Bookmarks | AniProject'

    }, [])

    return (
        <C.Container tabIndex={tabIndex}>

            {loading ? (
                <>
                    <AsideNavLinks />

                    <div className='main skeleton'>
                        <div className='skeleton-name'></div>
                        <div className='grid'>
                            <div className='skeleton-grid-item'>
                            </div>
                            <div className='skeleton-grid-item'>
                            </div>
                            <div className='skeleton-grid-item'>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <AsideNavLinks />

                    <div className='main'>
                        <h1>
                            Bookmarks {tabIndex === 1 && ('- Animes')}
                            {tabIndex === 2 && ('- Mangas')}
                            {tabIndex === 3 && ('- Movies')}
                            {tabIndex === 4 && ('- Others')}
                        </h1>

                        <div className='content'>
                            {allTypes != null || undefined ? (
                                <>
                                    <div id='tab-0'>
                                        <div className='grid'>

                                            <>
                                                {
                                                    allTypes.map((item: any, key: any) => (
                                                        <Link
                                                            key={item.id ? item.id : item.idGoGoAnime}
                                                            className='button-link'
                                                            to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                        >
                                                            <div className='grid-item' key={item.id}>

                                                                <div className='item-img'>
                                                                    <img src={`${item.coverImg}`} alt={`${item.fullTitle}`}>

                                                                    </img>
                                                                </div>

                                                                <div className='item-info'>

                                                                    {item.fullTitle && (
                                                                        <Link
                                                                            to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                                        >
                                                                            <h1>
                                                                                {item.fullTitle.length > 15 ? (
                                                                                    `${item.fullTitle.slice(0, 15)}...`
                                                                                ) : (
                                                                                    item.fullTitle
                                                                                )}
                                                                            </h1>
                                                                        </Link>
                                                                    )}

                                                                    <div className='info'>
                                                                        {item.nativeTitle && (
                                                                            <small>{item.nativeTitle}</small>
                                                                        )}

                                                                        {item.idGoGoAnime && (
                                                                            <span><strong>From GoGoAnime</strong></span>
                                                                        )}
                                                                    </div>

                                                                    <ul>
                                                                        {item.status && (
                                                                            <li>Status: <span>{item.status}</span></li>
                                                                        )}
                                                                        <li>
                                                                            <span>
                                                                                {item.type}{item.format && (<>
                                                                                    , {item.format}
                                                                                </>)}
                                                                            </span>
                                                                        </li>
                                                                    </ul>

                                                                </div>

                                                            </div>
                                                        </Link>

                                                    ))
                                                }
                                            </>

                                        </div>
                                    </div>

                                    <div id='tab-1'>
                                        <div className='grid'>

                                            {animesTypeItems &&
                                                <>
                                                    {
                                                        animesTypeItems.map((item: any, key: any) => (
                                                            <Link
                                                                key={item.id ? item.id : item.idGoGoAnime}
                                                                className='button-link'
                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                            >
                                                                <div className='grid-item' key={item.id}>

                                                                    <div className='item-img'>
                                                                        <img src={`${item.coverImg}`} alt={`${item.fullTitle}`}>

                                                                        </img>
                                                                    </div>

                                                                    <div className='item-info'>

                                                                        {item.fullTitle && (
                                                                            <Link
                                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                                            >
                                                                                <h1>
                                                                                    {item.fullTitle.length > 15 ? (
                                                                                        `${item.fullTitle.slice(0, 15)}...`
                                                                                    ) : (
                                                                                        item.fullTitle
                                                                                    )}
                                                                                </h1>
                                                                            </Link>
                                                                        )}

                                                                        <div className='info'>
                                                                            {item.nativeTitle && (
                                                                                <small>{item.nativeTitle}</small>
                                                                            )}

                                                                            {item.idGoGoAnime && (
                                                                                <span><strong>From GoGoAnime</strong></span>
                                                                            )}
                                                                        </div>

                                                                        <ul>
                                                                            {item.status && (
                                                                                <li>Status: <span>{item.status}</span></li>
                                                                            )}
                                                                            {item.format && (
                                                                                <li><span>
                                                                                    {item.type}{item.format && (<>
                                                                                        , {item.format}
                                                                                    </>)}
                                                                                </span></li>
                                                                            )}
                                                                        </ul>

                                                                    </div>

                                                                </div>
                                                            </Link>

                                                        ))
                                                    }
                                                </>
                                            }

                                        </div>
                                    </div>

                                    <div id='tab-2'>
                                        <div className='grid'>

                                            {mangasTypeItems &&

                                                <>
                                                    {
                                                        mangasTypeItems.map((item: any, key: any) => (
                                                            <Link
                                                                key={item.id ? item.id : item.idGoGoAnime}
                                                                className='button-link'
                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                            >
                                                                <div className='grid-item' key={item.id}>

                                                                    <div className='item-img'>
                                                                        <img src={`${item.coverImg}`} alt={`${item.fullTitle}`}>

                                                                        </img>
                                                                    </div>

                                                                    <div className='item-info'>

                                                                        {item.fullTitle && (
                                                                            <Link
                                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                                            >
                                                                                <h1>
                                                                                    {item.fullTitle.length > 15 ? (
                                                                                        `${item.fullTitle.slice(0, 15)}...`
                                                                                    ) : (
                                                                                        item.fullTitle
                                                                                    )}
                                                                                </h1>
                                                                            </Link>
                                                                        )}

                                                                        <div className='info'>
                                                                            {item.nativeTitle && (
                                                                                <small>{item.nativeTitle}</small>
                                                                            )}

                                                                            {item.idGoGoAnime && (
                                                                                <span><strong>From GoGoAnime</strong></span>
                                                                            )}
                                                                        </div>

                                                                        <ul>
                                                                            {item.status && (
                                                                                <li>Status: <span>{item.status}</span></li>
                                                                            )}
                                                                            {item.type && (
                                                                                <li><span>
                                                                                    {item.type}{item.format && (<>
                                                                                        , {item.format}
                                                                                    </>)}
                                                                                </span></li>
                                                                            )}
                                                                        </ul>

                                                                    </div>

                                                                </div>
                                                            </Link>

                                                        ))
                                                    }
                                                </>
                                            }

                                        </div>
                                    </div>

                                    <div id='tab-3'>
                                        <div className='grid'>

                                            {moviesTypeItems &&

                                                <>
                                                    {
                                                        moviesTypeItems.map((item: any, key: any) => (
                                                            <Link
                                                                key={item.id ? item.id : item.idGoGoAnime}
                                                                className='button-link'
                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                            >
                                                                <div className='grid-item' key={item.id}>

                                                                    <div className='item-img'>
                                                                        <img src={`${item.coverImg}`} alt={`${item.fullTitle}`}>

                                                                        </img>
                                                                    </div>

                                                                    <div className='item-info'>

                                                                        {item.fullTitle && (
                                                                            <Link
                                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                                            >
                                                                                <h1>
                                                                                    {item.fullTitle.length > 15 ? (
                                                                                        `${item.fullTitle.slice(0, 15)}...`
                                                                                    ) : (
                                                                                        item.fullTitle
                                                                                    )}
                                                                                </h1>
                                                                            </Link>
                                                                        )}

                                                                        <div className='info'>
                                                                            {item.nativeTitle && (
                                                                                <small>{item.nativeTitle}</small>
                                                                            )}

                                                                            {item.idGoGoAnime && (
                                                                                <span><strong>From GoGoAnime</strong></span>
                                                                            )}
                                                                        </div>

                                                                        <ul>
                                                                            {item.status && (
                                                                                <li>Status: <span>{item.status}</span></li>
                                                                            )}
                                                                            {item.type && (
                                                                                <li><span>
                                                                                    {item.type}{item.format && (<>
                                                                                        , {item.format}
                                                                                    </>)}
                                                                                </span></li>
                                                                            )}
                                                                        </ul>

                                                                    </div>

                                                                </div>
                                                            </Link>

                                                        ))
                                                    }
                                                </>
                                            }

                                        </div>
                                    </div>

                                    <div id='tab-4'>
                                        <div className='grid'>

                                            {otherTypeItems &&

                                                <>
                                                    {
                                                        otherTypeItems.map((item: any, key: any) => (
                                                            <Link
                                                                key={item.id ? item.id : item.idGoGoAnime}
                                                                className='button-link'
                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                            >
                                                                <div className='grid-item' key={item.id}>

                                                                    <div className='item-img'>
                                                                        <img src={`${item.coverImg}`} alt={`${item.fullTitle}`}>

                                                                        </img>
                                                                    </div>

                                                                    <div className='item-info'>

                                                                        {item.fullTitle && (
                                                                            <Link
                                                                                to={`/${(item.fromGoGoAnime === true && 'anime/v2') || (item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id ? item.id : item.idGoGoAnime}`}
                                                                            >
                                                                                <h1>
                                                                                    {item.fullTitle.length > 15 ? (
                                                                                        `${item.fullTitle.slice(0, 15)}...`
                                                                                    ) : (
                                                                                        item.fullTitle
                                                                                    )}
                                                                                </h1>
                                                                            </Link>
                                                                        )}

                                                                        <div className='info'>
                                                                            {item.nativeTitle && (
                                                                                <small>{item.nativeTitle}</small>
                                                                            )}

                                                                            {item.idGoGoAnime && (
                                                                                <span><strong>From GoGoAnime</strong></span>
                                                                            )}
                                                                        </div>

                                                                        <ul>
                                                                            {item.status && (
                                                                                <li>Status: <span>{item.status}</span></li>
                                                                            )}
                                                                            {item.type && (
                                                                                <li><span>
                                                                                    {item.type}{item.format && (<>
                                                                                        , {item.format}
                                                                                    </>)}
                                                                                </span></li>
                                                                            )}
                                                                        </ul>

                                                                    </div>

                                                                </div>
                                                            </Link>

                                                        ))
                                                    }
                                                </>
                                            }

                                        </div>
                                    </div>

                                    <div className='sort'>

                                        <div className='media-type'>
                                            <h1>Type</h1>

                                            <div>
                                                <p onClick={() => setTabIndex(0)}>All ({userInfo.mediaAdded.length})</p>
                                                <p onClick={() => setTabIndex(1)}>Animes ({animesTypeItems?.length})</p>
                                                <p onClick={() => setTabIndex(2)}>Mangas ({mangasTypeItems?.length})</p>
                                                <p onClick={() => setTabIndex(3)}>Movies ({moviesTypeItems?.length})</p>
                                                <p onClick={() => setTabIndex(4)}>Others ({otherTypeItems?.length})</p>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            ) : (

                                <div className='no-items-bookmarked'>

                                    <h2>There's Nothing Marked on Your Bookmarks</h2>

                                    <p>

                                        When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                    </p>

                                    <p>

                                        Use it as much as you want!

                                    </p>

                                </div>

                            )}

                        </div>
                    </div>
                </>
            )
            }
        </C.Container >
    )
}
