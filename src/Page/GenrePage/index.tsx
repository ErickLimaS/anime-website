import React, { useEffect, useState } from 'react'
import * as C from './styles'
import API from '../../API/anilist'
import { useParams } from 'react-router'
import AsideNavLinks from '../../Components/AsideNavLinks'
import HeadingContent from '../../Components/Home/HeadingContent'
import TopRated from '../../Components/Home/TopRated'
import { ReactComponent as ArrowLeftSvg } from '../../imgs/svg/arrow-left-short.svg'

export default function GenrePage() {

    const { genre } = useParams()
    const [animesGenreList, setAnimesGenreList] = useState([])
    const [mangasGenreList, setMangasGenreList] = useState([])
    const [randomIndex, setRandomIndex] = useState<number>(0)

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        document.title = `${genre} Genre`

        const load = async () => {

            setLoading(true)

            const data1 = await API.getAnimesForThisGenre(genre)
            const data2 = await API.getMangasForThisGenre(genre)

            setAnimesGenreList(data1)
            setMangasGenreList(data2)

            setRandomIndex(Math.floor(Math.random() * data1.length))

            setLoading(false)

        }
        load()

    }, [genre])

    return (
        <C.Container>

            {loading === true ? (
                <>
                    <AsideNavLinks />

                    <div className='content skeleton'>
                        <div className='skeleton-name'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                        <div className='skeleton-section'></div>
                    </div>
                </>
            ) : (

                <>
                    <AsideNavLinks />

                    <div className='content'>

                        <h1>{genre}</h1>

                        <HeadingContent data={animesGenreList[randomIndex]} />

                        <div className='top-rated-anime'>

                            <div className='heading'>
                                <h2>Top Rated <span>{genre} Animes</span></h2>

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

                        <div className='top-rated-manga'>

                            <div className='heading'>
                                <h2>Top Rated <span>{genre} Mangas</span></h2>

                                <div className='nav-buttons'>
                                    <button type='button'><ArrowLeftSvg /></button>
                                    <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
                                </div>
                            </div>

                            <div className='list'>
                                {mangasGenreList.map((item: any, key) => (

                                    <TopRated data={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

        </C.Container>
    )
}
