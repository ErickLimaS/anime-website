import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import API from '../../API/anilist'
import HeadingContent from '../../Components/Home/HeadingContent'
import AnimesReleasingThisWeek from '../../Components/Home/AnimesReleasingThisWeekList'
import { ReactComponent as ArrowLeftSvg } from '../../imgs/svg/arrow-left-short.svg'
import { ReactComponent as DotSvg } from '../../imgs/svg/dot.svg'
import Trending from '../../Components/Home/Trending'
import SearchInnerPage from '../../Components/SearchInnerPage'
import TopRated from '../../Components/Home/TopRated'
import AsideNavLinks from '../../Components/AsideNavLinks'

export default function Home() {

  const [indexInnerPageLink, setIndexInnerPageLink] = useState(0) //aux to show inner page

  // const [increaseIdNumberFromMap, setIncreaseIdNumberFromMape] = useState(0)
  // setIncreaseIdNumberFromMape((increaseIdNumberFromMap) + 1)

  const [loading, setLoading] = useState(true)

  const [releasingThisSeason, setReleasingThisSeason] = useState([])
  const [releasingThisWeek, setReleasingThisWeek] = useState([])
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])

  useEffect(() => {

    window.scrollTo(0, 0);
    
    const loadData = async () => {

      setLoading(true)

      let data1, data2, data3, data4;

      switch (indexInnerPageLink) {

        case 0: //ANIME
          //stores the heading content, which is the releases of the season
          data1 = await API.getNewReleases('ANIME')
          setReleasingThisSeason(data1)

          //stores releases of this week
          data2 = await API.getReleasingThisWeek('ANIME')
          setReleasingThisWeek(data2)

          //stores what is trending 
          data3 = await API.getTrending('ANIME')
          setTrending(data3)

          //stores top rated animes
          data4 = await API.getTopRated('ANIME');
          setTopRated(data4)

          setLoading(false)

          break;

        case 1: //MANGA
          //stores the heading content, which is the releases of the season
          data1 = await API.getNewReleases('MANGA')
          setReleasingThisSeason(data1)

          //stores releases of this week
          data2 = await API.getReleasingThisWeek('MANGA')
          setReleasingThisWeek(data2)

          //stores what is trending 
          data3 = await API.getTrending('MANGA')
          setTrending(data3)

          //stores top rated animes
          data4 = await API.getTopRated('MANGA');
          setTopRated(data4)

          setLoading(false)

          break;

        case 2: //MOVIE
          //stores the heading content, which is the releases of the season
          data1 = await API.getNewReleases('ANIME', 'MOVIE')
          setReleasingThisSeason(data1)

          //stores releases of this week
          data2 = await API.getReleasingThisWeek('ANIME', 'MOVIE')
          setReleasingThisWeek(data2)

          //stores what is trending 
          data3 = await API.getTrending('ANIME', 'MOVIE')
          setTrending(data3)

          //stores top rated animes
          data4 = await API.getTopRated('ANIME', 'MOVIE');
          setTopRated(data4)

          setLoading(false)

          break;
      }

    }
    loadData()

    console.log(releasingThisSeason)

  }, [indexInnerPageLink])


  return (
    <C.Container innerPageLink={indexInnerPageLink}>

      <AsideNavLinks />

      <div className='main-content'>

        <div className='search-mobile'>
          <SearchInnerPage />
        </div>

        <nav className='links-inner-page'>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(0)} className='anime'>Anime</Link>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(1)} className='manga'>Manga</Link>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(2)} className='movie'>Movie</Link>
        </nav>

        <section id='anime'>
          <div className={loading === true ? 'banne-most-watch div-skeleton' : 'banne-most-watch'}>
            {loading === false && (
              releasingThisSeason.map((item: any, key) => (
                <HeadingContent key={key} data={item} />
              ))
            )}
          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='releasing-this-week'>
              {loading === false && (
                releasingThisWeek.map((item: any, key) => (
                  <AnimesReleasingThisWeek key={key} data={item} />
                ))
              )}
            </div>

          </div>

          <div className={loading === true ? 'best-rated div-skeleton' : 'best-rated'}>
            <div className='heading'>

              <h2>Top Rated Animes</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='top-rated-animes'>
              {loading === false && (
                topRated.map((item, key) => (
                  <TopRated key={key} data={item} />
                ))
              )}
            </div>
          </div>
        </section>

        <section id='manga'>
          <div className={loading === true ? 'banne-most-watch div-skeleton' : 'banne-most-watch'}>
            {loading === false && (
              releasingThisSeason.map((item: any, key) => (
                <HeadingContent key={key} data={item} />
              ))
            )}
          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='releasing-this-week'>
              {loading === false && (
                releasingThisWeek.map((item: any, key) => (
                  <AnimesReleasingThisWeek key={key} data={item} />
                ))
              )}
            </div>

          </div>

          <div className={loading === true ? 'best-rated div-skeleton' : 'best-rated'}>
            <div className='heading'>

              <h2>Top Rated Mangas</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='top-rated-animes'>
              {loading === false && (
                topRated.map((item, key) => (
                  <TopRated key={key} data={item} />
                ))
              )}
            </div>
          </div>
        </section>

        <section id='movie'>
          <div className={loading === true ? 'banne-most-watch div-skeleton' : 'banne-most-watch'}>
            {loading === false && (
              releasingThisSeason.map((item: any, key) => (
                <HeadingContent key={key} data={item} />
              ))
            )}
          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='releasing-this-week'>
              {loading === false && (
                releasingThisWeek.map((item: any, key) => (
                  <AnimesReleasingThisWeek key={key} data={item} />
                ))
              )}
            </div>

          </div>

          <div className={loading === true ? 'best-rated div-skeleton' : 'best-rated'}>
            <div className='heading'>

              <h2>Top Rated Movies</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='top-rated-animes'>
              {loading === false && (
                topRated.map((item, key) => (
                  <TopRated key={key} data={item} />
                ))
              )}
            </div>
          </div>
        </section>
      </div >

      <aside>

        <div className='search'>

          <SearchInnerPage />

        </div>

        <div className={loading === true ? 'trending div-skeleton' : 'trending'}>
          {loading === false && (
            <>
              <div className='trending-heading'>
                <h3>Trending</h3>
                <div>
                  <DotSvg />
                  <DotSvg />
                </div>
              </div>
              <div className='trending-items'>
                {trending.slice(0,3).map((item, key) => (
                  <Trending key={key} data={item} />
                ))}
                <Link to={`/animes/trending`} className='button-see-more'>See More</Link>
              </div>

            </>
          )}

        </div>
      </aside>

    </C.Container >

  )
}
