import * as C from './styles'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import { Link } from 'react-router-dom'


export default function BookmarkUser() {

    const [loading, setLoading] = useState(false)

    const [typeSort, setTypeSort] = useState()
    const [sort, setSort] = useState<any>(null)

    const selectTypeRef: MutableRefObject<any> = useRef()
    const selectAddedWhenRef: MutableRefObject<any> = useRef()

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const navigate = useNavigate()

    useEffect(() => {

        setLoading(true)

        if (!userInfo) {

            navigate('/')

        }

        setLoading(false)

    }, [])

    // makes sorting of bookmark items
    const handleSelectSort = () => {

        setLoading(true)

        const sort = userInfo.mediaAdded.filter((item: any) => {

            switch (selectAddedWhenRef.current.value) {
                case "ALL-TIME":
                    if (item.type === "ALL") {

                        console.log(item)
                        return item
                    }
                    break;
                case "7-DAYS":
                    console.log(item)

                    return item.addedAt > new Date().getDate() - 7 && item.addedAt <= new Date() && item.type === `${selectTypeRef.current.value}`
                case "30-DAYS":
                    console.log(item)

                    return item.addedAt > new Date().getDate() - 30 && item.addedAt <= new Date() && item.type === `${selectTypeRef.current.value}`

            }

        })

        setSort(sort)
        console.log(sort)

        setLoading(false)

    }

    console.log(sort)

    return (
        <C.Container>

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
                        <h1>Bookmarks</h1>

                        <div className='sort'>

                            <div className='media-type'>
                                <label htmlFor='type'>Type</label>

                                <select name='type' id='type'
                                    ref={selectTypeRef}
                                    onChange={() => handleSelectSort()}
                                >
                                    <option selected value="ALL">All</option>
                                    <option value='ANIME'>Anime</option>
                                    <option value='MANGA'>Manga</option>
                                    <option value='MOVIE'>Movie</option>
                                </select>
                            </div>
                            <div className='media-when-added'>
                                <label htmlFor='when-added'>Added in</label>

                                <select name='when-added' id='when-added'
                                    ref={selectAddedWhenRef}
                                    onChange={() => handleSelectSort()}
                                >
                                    <option selected value='ALL-TIME'>All Time</option>
                                    <option value='7-DAYS'>Last 7 Days</option>
                                    <option value='30-DAYS'>Last 30 Days</option>
                                </select>
                            </div>

                        </div>

                        {userInfo.mediaAdded != null || undefined ? (

                            <div className='grid'>

                                {sort == null ? (
                                    <>
                                        {
                                            userInfo.mediaAdded.map((item: any, key: any) => (
                                                <Link className='button-link' to={`/${(item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id}`}>
                                                    <div className='grid-item' key={item.id}>

                                                        <div className='item-img'>
                                                            <img src={`${item.coverImg}`} alt={`${item.fullTitle}`}>

                                                            </img>
                                                        </div>

                                                        <div className='item-info'>

                                                            {item.fullTitle && (
                                                                <Link to={`/${(item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id}`}>
                                                                    <h1>
                                                                        {item.fullTitle.length > 15 ? (
                                                                            `${item.fullTitle.slice(0, 15)}...`
                                                                        ) : (
                                                                            item.fullTitle
                                                                        )}
                                                                    </h1>
                                                                </Link>
                                                            )}
                                                            {item.nativeTitle && (
                                                                <small>{item.nativeTitle}</small>
                                                            )}

                                                            <ul>
                                                                {item.status && (
                                                                    <li>Status: {item.status}</li>
                                                                )}
                                                                <li>Type: {item.type}</li>
                                                                <li>Format: {item.format}</li>
                                                            </ul>

                                                        </div>

                                                    </div>
                                                </Link>

                                            ))
                                        }
                                    </>
                                ) : (
                                    <>
                                        {sort.map((item: any, key: any) => (
                                            <Link className='button-link' to={`/${(item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id}`}>
                                                <div className='grid-item' key={item.id}>

                                                    <div className='item-img'>
                                                        <img src={`https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx108556-NHjkz0BNJhLx.jpg`} alt={`${item.fullTitle}`}>

                                                        </img>
                                                    </div>

                                                    <div className='item-info'>

                                                        {item.fullTitle && (
                                                            <Link to={`/${(item.format === 'MOVIE' && 'movie') || (item.type === `ANIME` && `anime`) || (item.type === `MANGA` && `manga`)}/${item.id}`}>
                                                                <h1>
                                                                    {item.fullTitle.length > 15 ? (
                                                                        `${item.fullTitle.slice(0, 15)}...`
                                                                    ) : (
                                                                        item.fullTitle
                                                                    )}
                                                                </h1>
                                                            </Link>
                                                        )}
                                                        {item.nativeTitle && (
                                                            <small>{item.nativeTitle}</small>
                                                        )}

                                                        <ul>
                                                            {item.status && (
                                                                <li>Status: {item.status}</li>
                                                            )}
                                                            <li>Type: {item.type}</li>
                                                            <li>Format: {item.format}</li>
                                                        </ul>

                                                    </div>

                                                </div>
                                            </Link>

                                        ))}
                                    </>
                                )}


                            </div>
                        ) : (

                            <div>

                                <h2>There's Nothing Marked on Your Bookmarks.</h2>

                                <p>

                                    When on a anime, manga or movie is shown, a ICON must be show to indicate you can add it to bookmarks.

                                </p>

                                <p>

                                    Use it as much as you want!

                                </p>

                            </div>

                        )}

                    </div>
                </>
            )
            }
        </C.Container >
    )
}
