import React, { useEffect, useState } from 'react'
import * as C from './styles'
import API from '../../API/anilist'
import { useParams } from 'react-router'
import AsideNavLinks from '../../Components/Layout/AsideNavLinks'
import HeadingContent from '../../Components/Home/HeadingContent'
import TopRated from '../../Components/TopRated'
import { ReactComponent as ArrowLeftSvg } from '../../imgs/svg/arrow-left-short.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../imgs/svg/angle-right-solid.svg'
import Trending from '../../Components/Trending'
import { useSelector } from 'react-redux'

export default function GenrePage() {

    const { genre } = useParams()

    const [animesGenreList, setAnimesGenreList] = useState([])
    const [mangasGenreList, setMangasGenreList] = useState([])
    const [animesTrending, setAnimesTrending] = useState([])
    const [mangasTrending, setMangasTrending] = useState([])

    const [indexPageAnimeList, setIndexPageAnimeList] = useState<number>(1)
    const [indexPageMangaList, setIndexPageMangaList] = useState<number>(1)

    const [randomIndex, setRandomIndex] = useState<number>(0)

    const [loading, setLoading] = useState(true)
    const [loadingSectionTopRated, setLoadingSectionTopRated] = useState(false)
    const [loadingSectionReleasingThisWeek, setLoadingSectionReleasingThisWeek] = useState(false)

    useEffect(() => {

        window.scrollTo(0, 0);

        document.title = `${genre} Genre | AniProject`

        const load = async () => {

            setLoading(true)

            const data1 = await API.getAnimesForThisGenre(genre)
            const data2 = await API.getMangasForThisGenre(genre)
            const data3 = await API.getTrending('ANIME', '', genre)
            const data4 = await API.getTrending('MANGA', '', genre)

            setAnimesGenreList(data1)
            setMangasGenreList(data2)
            setAnimesTrending(data3)
            setMangasTrending(data4)

            setRandomIndex(Math.floor(Math.random() * data1.length))

            setLoading(false)

        }
        load()

    }, [genre])

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    //handles button navigation through results to topRated and Releasing sections
    const handleSectionPreviousPage = async (section: String) => {

        switch (section) {

            case 'anime':

                let page;

                if (indexPageAnimeList <= 1) {
                    page = 1
                    setIndexPageAnimeList(1)
                    console.log(page)
                }
                else {
                    page = indexPageAnimeList - 1
                    setIndexPageAnimeList(indexPageAnimeList - 1)
                    console.log(page)
                }

                const data = await API.getAnimesForThisGenre(genre, page);
                setAnimesGenreList(data)

                break;

            case 'manga':

                let page1

                if (indexPageMangaList <= 1) {
                    page1 = 1
                    setIndexPageMangaList(1)
                }
                else {
                    page1 = indexPageMangaList - 1
                    setIndexPageMangaList(indexPageMangaList - 1)
                }

                const data1 = await API.getMangasForThisGenre(genre, page1);
                setMangasGenreList(data1)

                break;

        }

    }

    //handles button navigation through results to topRated and Releasing sections
    const handleSectionNextPage = async (section: String) => {

        switch (section) {

            case 'anime':

                const page = indexPageAnimeList + 1
                setIndexPageAnimeList(indexPageAnimeList + 1)

                const data = await API.getAnimesForThisGenre(genre, page);
                setAnimesGenreList(data)

                break;

            case 'manga':

                const page1 = indexPageMangaList + 1
                setIndexPageMangaList(indexPageMangaList + 1)

                const data1 = await API.getMangasForThisGenre(genre, page1);
                setMangasGenreList(data1)

                break;

        }

    }

    return (
        <C.Container darkMode={darkMode}>

            {loading === true ? (
                <>
                    <AsideNavLinks data={genre} />

                    <div className='content skeleton'>
                        <div className='skeleton-name'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                    </div>
                </>
            ) : (

                <>
                    <AsideNavLinks data={genre} />

                    <div className='content'>

                        <h1>{genre}</h1>

                        <HeadingContent data={animesGenreList[randomIndex]} />

                        <div className='top-rated-anime'>

                            <div className='heading'>
                                <h2>Top Rated <span>{genre} Animes</span></h2>

                                <div className='nav-buttons'>
                                    <button
                                        type='button'
                                        disabled={indexPageAnimeList === 1 ? true : false}
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

                        <div className='top-rated-manga'>

                            <div className='heading'>
                                <h2>Top Rated <span>{genre} Mangas</span></h2>

                                <div className='nav-buttons'>
                                    <button
                                        type='button'
                                        disabled={indexPageMangaList === 1 ? true : false}
                                        onClick={() => handleSectionPreviousPage('manga')}
                                    >
                                        <AngleLeftSolidSvg />
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => handleSectionNextPage('manga')}
                                    >
                                        <AngleRightSolidSvg />
                                    </button>
                                </div>
                            </div>

                            <div className='list'>
                                {mangasGenreList.map((item: any, key) => (

                                    <TopRated data={item} />
                                ))}
                            </div>
                        </div>

                        <div className='trending'>

                            <div className='trending-anime'>

                                <div className='heading'>

                                    <h2>Trending <span> Mangas</span></h2>

                                </div>


                                {mangasTrending.map((item: any, key) => (

                                    <Trending data={item} />

                                ))}

                            </div>

                            <div className='trending-manga'>

                                <div className='heading'>

                                    <h2>Trending <span> Animes</span></h2>

                                </div>

                                {animesTrending.map((item: any, key) => (

                                    <Trending data={item} />

                                ))}

                            </div>

                        </div>
                    </div>
                </>
            )}

        </C.Container>
    )
}
