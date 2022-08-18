import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import API from '../../API/anilist'
import HeadingContent from '../../Components/Home/HeadingContent'
import AnimesReleasingThisWeek from '../../Components/Home/AnimesReleasingThisWeekList'
import { ReactComponent as ArrowLeftSvg } from '../../imgs/svg/arrow-left-short.svg'
import { ReactComponent as DotSvg } from '../../imgs/svg/dot.svg'
import { ReactComponent as AngleLeftSolidSvg } from '../../imgs/svg/angle-left-solid.svg'
import { ReactComponent as AngleRightSolidSvg } from '../../imgs/svg/angle-right-solid.svg'
import Trending from '../../Components/Home/Trending'
import SearchInnerPage from '../../Components/SearchInnerPage'
import TopRated from '../../Components/Home/TopRated'
import AsideNavLinks from '../../Components/AsideNavLinks'
import { useSelector } from 'react-redux'

export default function Home() {

  const [indexInnerPageLink, setIndexInnerPageLink] = useState(0) //aux to show inner page

  const [loading, setLoading] = useState(true)
  const [loadingSectionTopRated, setLoadingSectionTopRated] = useState(false)
  const [loadingSectionReleasingThisWeek, setLoadingSectionReleasingThisWeek] = useState(false)

  const [randomIndex, setRandomIndex] = useState<number>(0)

  const [releasingThisSeason, setReleasingThisSeason] = useState([])
  const [releasingThisWeek, setReleasingThisWeek] = useState([])
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])

  const [indexPageTopRated, setIndexPageTopRated] = useState<number>(1)
  const [indexPageReleasingThisWeek, setIndexPageReleasingThisWeek] = useState<number>(1)

  // user state
  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin

  // dark mode
  const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
  const { darkMode } = darkModeSwitch

  useEffect(() => {

    window.scrollTo(0, 0);

    document.title = 'Home | AniProject'

    document.title = 'Loading... | AniProject'

    const loadData = async () => {

      setLoading(true)

      let data1, data2, data3, data4;

      switch (indexInnerPageLink) {

        case 0: //ANIME
          //stores the heading content, which is the releases of the season
          data1 = await API.getNewReleases('ANIME')
          setReleasingThisSeason(data1)

          setRandomIndex(Math.floor(Math.random() * data1.length))

          //stores releases of this week
          data2 = await API.getReleasingThisWeek('ANIME')
          setReleasingThisWeek(data2)

          //stores what is trending 
          data3 = await API.getTrending('ANIME', '', '')
          setTrending(data3)

          //stores top rated animes
          data4 = await API.getTopRated('ANIME');
          setTopRated(data4)

          setLoading(false)

          break;

        case 1: //MANGA
          //stores the heading content, which is the releases of the season
          // data1 = await API.getNewReleases('MANGA')
          // setReleasingThisSeason(data1)

          // setRandomIndex(Math.floor(Math.random() * data1.length))

          //stores releases of this week
          data2 = await API.getReleasingThisWeek('MANGA')
          setReleasingThisWeek(data2)

          //stores what is trending 
          data3 = await API.getTrending('MANGA', '', '')
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

          setRandomIndex(Math.floor(Math.random() * data1.length))

          //stores releases of this week
          data2 = await API.getReleasingThisWeek('ANIME', 'MOVIE')
          setReleasingThisWeek(data2)

          //stores what is trending 
          data3 = await API.getTrending('ANIME', 'MOVIE', '')
          setTrending(data3)

          //stores top rated animes
          data4 = await API.getTopRated('ANIME', 'MOVIE');
          setTopRated(data4)

          setLoading(false)

          break;
      }

    }
    loadData()

  }, [indexInnerPageLink])

  //handles button navigation through results to topRated and Releasing sections
  const handleSectionPreviousPage = async (section: String, mediaType: String, mediaFormat?: String) => {

    switch (section) {

      case 'top-rated':
        setLoadingSectionTopRated(true)

        let page;

        if (indexPageTopRated <= 1) {
          page = 1
          setIndexPageTopRated(1)
          console.log(page)
        }
        else {
          page = indexPageTopRated - 1
          setIndexPageTopRated(indexPageTopRated - 1)
          console.log(page)
        }

        const data = await API.getTopRated(mediaType, mediaFormat && mediaFormat, page);
        setTopRated(data)

        setLoadingSectionTopRated(false)
        break;

      case 'releasing-this-week':
        setLoadingSectionReleasingThisWeek(true)

        let page1

        if (indexPageReleasingThisWeek <= 1) {
          page1 = 1
          setIndexPageReleasingThisWeek(1)
        }
        else {
          page1 = indexPageReleasingThisWeek - 1
          setIndexPageReleasingThisWeek(indexPageReleasingThisWeek - 1)
        }

        const data1 = await API.getReleasingThisWeek(mediaType, mediaFormat && mediaFormat, page1);
        setReleasingThisWeek(data1)

        setLoadingSectionReleasingThisWeek(false)
        break;

    }

  }

  //handles button navigation through results to topRated and Releasing sections
  const handleSectionNextPage = async (section: String, mediaType: String, mediaFormat?: String) => {

    switch (section) {

      case 'top-rated':
        setLoadingSectionTopRated(true)

        const page = indexPageTopRated + 1
        setIndexPageTopRated(indexPageTopRated + 1)

        const data = await API.getTopRated(mediaType, mediaFormat && mediaFormat, page);
        setTopRated(data)

        setLoadingSectionTopRated(false)
        break;

      case 'releasing-this-week':
        setLoadingSectionReleasingThisWeek(true)

        const page1 = indexPageReleasingThisWeek + 1
        setIndexPageReleasingThisWeek(indexPageReleasingThisWeek + 1)

        const data1 = await API.getReleasingThisWeek(mediaType, mediaFormat && mediaFormat, page1);
        setReleasingThisWeek(data1)

        setLoadingSectionReleasingThisWeek(false)
        break;

    }

  }

  return (
    <C.Container
      innerPageLink={indexInnerPageLink}
      darkMode={darkMode}
    >

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

              <HeadingContent data={releasingThisSeason[randomIndex]} />

            )}
          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button
                  type='button'
                  disabled={indexPageReleasingThisWeek === 1 ? true : false}
                  onClick={() => handleSectionPreviousPage('releasing-this-week', 'ANIME')}
                >
                  <AngleLeftSolidSvg />
                </button>

                <button
                  type='button'
                  onClick={() => handleSectionNextPage('releasing-this-week', 'ANIME')}
                >
                  <AngleRightSolidSvg />
                </button>
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

                <button
                  type='button'
                  disabled={indexPageTopRated === 1 ? true : false}
                  onClick={() => handleSectionPreviousPage('top-rated', 'ANIME')}
                >
                  <AngleLeftSolidSvg />
                </button>

                <button
                  type='button'
                  onClick={() => handleSectionNextPage('top-rated', 'ANIME')}
                >
                  <AngleRightSolidSvg />
                </button>

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

          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button
                  type='button'
                  disabled={indexPageReleasingThisWeek === 1 ? true : false}
                  onClick={() => handleSectionPreviousPage('releasing-this-week', 'MANGA')}
                >
                  <AngleLeftSolidSvg />
                </button>

                <button
                  type='button'
                  onClick={() => handleSectionNextPage('releasing-this-week', 'MANGA')}
                >
                  <AngleRightSolidSvg />
                </button>
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
                <button
                  type='button'
                  disabled={indexPageTopRated === 1 ? true : false}
                  onClick={() => handleSectionPreviousPage('top-rated', 'MANGA')}
                >
                  <AngleLeftSolidSvg />
                </button>

                <button
                  type='button'
                  onClick={() => handleSectionNextPage('top-rated', 'MANGA')}
                >
                  <AngleRightSolidSvg />
                </button>
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

              <HeadingContent data={releasingThisSeason[randomIndex]} />

            )}
          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button
                  type='button'
                  disabled={indexPageTopRated === 1 ? true : false}
                  onClick={() => handleSectionPreviousPage('releasing-this-week', 'ANIME', 'MOVIE')}
                >
                  <AngleLeftSolidSvg />
                </button>

                <button
                  type='button'
                  onClick={() => handleSectionNextPage('releasing-this-week', 'ANIME', 'MOVIE')}
                >
                  <AngleRightSolidSvg />
                </button>
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
                <button
                  type='button'
                  disabled={indexPageTopRated === 1 ? true : false}
                  onClick={() => handleSectionPreviousPage('top-rated', 'ANIME', 'MOVIE')}
                >
                  <AngleLeftSolidSvg />
                </button>

                <button
                  type='button'
                  onClick={() => handleSectionNextPage('top-rated', 'ANIME', 'MOVIE')}
                >
                  <AngleRightSolidSvg />
                </button>
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
                {trending.slice(0, 3).map((item: any, key) => (
                  <Trending key={key} data={item} />
                ))}
              </div>

            </>
          )}
          {(userInfo !== null && userInfo.mediaAdded !== null) && (
            loading === false && (
              <>
                <div className='trending-heading'>
                  <h3>Bookmarks</h3>
                  <div>
                    <DotSvg />
                    <DotSvg />
                  </div>
                </div>
                <div className='trending-items'>
                  {userInfo.mediaAdded.slice(0, 3).map((item: any, key: any) => (
                    <Trending key={key} data={item} />
                  ))}
                  <Link to={`/bookmarks`} className='button-see-more'>See More</Link>
                </div>

              </>
            )
          )}

        </div>

      </aside>

    </C.Container >

  )
}
