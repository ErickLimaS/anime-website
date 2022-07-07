import React, { useEffect, useState } from 'react'
import * as C from './styles'
import API from '../../API/anilist'
import { useParams } from 'react-router'
import AsideNavLinks from '../../Components/AsideNavLinks'
import HeadingContent from '../../Components/Home/HeadingContent'
import TopRated from '../../Components/Home/TopRated'
import { ReactComponent as ArrowLeftSvg } from '../../imgs/svg/arrow-left-short.svg'
import Trending from '../../Components/Home/Trending'

export default function FormatPage() {

    const { format } = useParams()
    function formatName(format: any) {
        return format.slice(0, 1).toUpperCase() + format.slice(1)
    }
    const name = formatName(format)

    const [animesGenreList, setAnimesGenreList] = useState([])
    const [mangasGenreList, setMangasGenreList] = useState([])
    const [animesTrending, setAnimesTrending] = useState([])
    const [mangasTrending, setMangasTrending] = useState([])

    const [randomIndex, setRandomIndex] = useState<number>(0)

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

    return (
        <C.Container>

            {loading === true ? (
                <>
                    <AsideNavLinks data={format} />

                    <div className='content skeleton'>
                        <div className='skeleton-name'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                    </div>
                </>
            ) : (

                <>
                    <AsideNavLinks data={format} />

                    <div className='content'>

                        <h1>{name} Format</h1>

                        <HeadingContent data={animesGenreList[randomIndex]} />

                        <div className='top-rated-anime'>

                            <div className='heading'>
                                <h2>Top Rated on <span>{name} Format</span></h2>

                                <div className='nav-buttons'>
                                    <button type='button'><ArrowLeftSvg /></button>
                                    <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
                                </div>
                            </div>

                            <div className='list'>
                                {animesGenreList.map((item: any, key) => (

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
            )
            }

        </C.Container >
    )
}
