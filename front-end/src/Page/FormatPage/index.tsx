import React, { useEffect, useState } from 'react'
import * as C from './styles'
import API from '../../API/anilist'
import { useParams } from 'react-router'
import AsideNavLinks from '../../Components/Layout/AsideNavLinks'
import HeadingContent from '../../Components/Home/HeadingContent'
import TopRated from '../../Components/TopRated'
import { ReactComponent as AngleLeftSolidSvg } from '../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../imgs/svg/angle-right-solid.svg'
import Trending from '../../Components/Trending'
import { useSelector } from 'react-redux'

export default function FormatPage() {

    const { format } = useParams()

    function formatName(format: any) {
        return format.slice(0, 1).toUpperCase() + format.slice(1)
    }

    const name = formatName(format)

    const [animesGenreList, setAnimesGenreList] = useState([])
    const [animesTrending, setAnimesTrending] = useState([])
    const [mangasTrending, setMangasTrending] = useState([])

    const [randomIndex, setRandomIndex] = useState<number>(0)

    const [indexPage, setIndexPage] = useState<number>(1)

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        window.scrollTo(0, 0);

        document.title = `${format?.toLocaleUpperCase()} Format | AniProject`

        const load = async () => {

            setLoading(true)

            const data1 = await API.getMediaForThisFormat(format)
            // const data2 = await API.getMangasForThisFormat(format)
            const data3 = await API.getTrending('ANIME', format, '')
            const data4 = await API.getTrending('MANGA', format, '')

            setAnimesGenreList(data1)
            // setMangasGenreList(data2)
            setAnimesTrending(data3)
            setMangasTrending(data4)

            setRandomIndex(Math.floor(Math.random() * data1.length))

            setLoading(false)

        }
        load()

    }, [format])

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    //handles button navigation through results to topRated and Releasing sections
    const handleSectionPreviousPage = async (section: String) => {

        let page: number;

        if (indexPage <= 1) {
            page = 1
            setIndexPage(1)
            console.log(page)
        }
        else {
            page = indexPage - 1
            setIndexPage(indexPage - 1)
            console.log(page)
        }

        const data = await API.getMediaForThisFormat(format, page);
        setAnimesGenreList(data)


    }

    //handles button navigation through results to topRated and Releasing sections
    const handleSectionNextPage = async (section: String) => {

        const page = indexPage + 1
        setIndexPage(indexPage + 1)

        const data = await API.getMediaForThisFormat(format, page);
        setAnimesGenreList(data)

    }

    return (
        <C.Container darkMode={darkMode}>

            {loading === true ? (
                <>

                    <div className='content skeleton'>
                        <div className='skeleton-name'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                    </div>

                </>
            ) : (

                <>

                    <h1>{name} Format</h1>

                    <HeadingContent data={animesGenreList[randomIndex]} />

                    <div className='top-rated-anime'>

                        <div className='heading'>
                            <h2>Top Rated <span>{name}'s</span></h2>

                            <div className='nav-buttons'>
                                <button
                                    type='button'
                                    disabled={indexPage === 1 ? true : false}
                                    onClick={() => handleSectionPreviousPage('anime')}
                                >
                                    <AngleLeftSolidSvg />
                                </button>

                                <button
                                    type='button'
                                    onClick={() => handleSectionNextPage('anime')}
                                >
                                    <AngleRightSolidSvg />
                                </button>
                            </div>
                        </div>

                        <div className='list'>
                            {animesGenreList.map((item: any, key) => (

                                <TopRated data={item} />
                            ))}
                        </div>
                    </div>

                    <div className='trending'>

                        <div className='trending-manga'>

                            <div className='heading'>

                                <h2>Trending <span> Mangas</span></h2>

                            </div>


                            {mangasTrending.map((item: any, key: any) => (

                                <Trending data={item} key={key}/>

                            ))}

                        </div>

                        <div className='trending-anime'>

                            <div className='heading'>

                                <h2>Trending <span> Animes</span></h2>

                            </div>

                            {animesTrending.map((item: any, key: any) => (

                                <Trending data={item} key={key}/>

                            ))}

                        </div>

                    </div>
                </>
            )
            }

        </C.Container >
    )
}
