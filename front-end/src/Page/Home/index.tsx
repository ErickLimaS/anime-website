import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import API from '../../API/anilist'
import HeadingContent from '../../Components/Home/HeadingContent'
import AnimesReleasingThisWeek from '../../Components/Home/AnimesReleasingThisWeekList'
import { ReactComponent as DotSvg } from '../../imgs/svg/dot.svg'
import Trending from '../../Components/Trending'
import SearchInnerPage from '../../Components/SearchInnerPage'
import TopRated from '../../Components/TopRated'
import AsideNavLinks from '../../Components/Layout/AsideNavLinks'
import { useSelector } from 'react-redux'
import NavButtons from '../../Components/Layout/NavButtons'

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

    document.title = 'Loading... | AniProject'

    // gets animes with banner img
    function hasBcgImg(item: any) {
      if (item.bannerImage != null) {
        return item
      }
    }

    const loadData = async () => {

      setLoading(true)

      let data1, data2, data3, data4;

      switch (indexInnerPageLink) {

        case 0: //ANIME
          //stores the heading content, which is the releases of the season
          data1 = await API.getNewReleases('ANIME')

          // gets animes with banner img
          data1 = data1.filter((item: any) => hasBcgImg(item))

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

          // gets animes with banner img
          data1 = data1.filter((item: any) => hasBcgImg(item))

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

    document.title = 'Home | AniProject'

  }, [indexInnerPageLink])

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

              <NavButtons
                param='releasing-this-week'
                section='ANIME'
                releasingThisWeek={releasingThisWeek}
                indexPageReleasingThisWeek={indexPageReleasingThisWeek}
                indexPageTopRated={indexPageTopRated}
                setIndexPageTopRated={setIndexPageTopRated}
                setLoadingSectionTopRated={setLoadingSectionTopRated}
                setTopRated={setTopRated}
                setLoadingSectionReleasingThisWeek={setLoadingSectionReleasingThisWeek}
                setReleasingThisWeek={setReleasingThisWeek}
                setIndexPageReleasingThisWeek={setIndexPageReleasingThisWeek}
              />

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

              <NavButtons
                param='top-rated'
                section='ANIME'
                topRated={topRated}
                indexPageReleasingThisWeek={indexPageReleasingThisWeek}
                indexPageTopRated={indexPageTopRated}
                setIndexPageTopRated={setIndexPageTopRated}
                setLoadingSectionTopRated={setLoadingSectionTopRated}
                setTopRated={setTopRated}
                setLoadingSectionReleasingThisWeek={setLoadingSectionReleasingThisWeek}
                setReleasingThisWeek={setReleasingThisWeek}
                setIndexPageReleasingThisWeek={setIndexPageReleasingThisWeek}
              />

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


              <NavButtons
                param='releasing-this-week'
                section='MANGA'
                releasingThisWeek={releasingThisWeek}
                indexPageReleasingThisWeek={indexPageReleasingThisWeek}
                indexPageTopRated={indexPageTopRated}
                setIndexPageTopRated={setIndexPageTopRated}
                setLoadingSectionTopRated={setLoadingSectionTopRated}
                setTopRated={setTopRated}
                setLoadingSectionReleasingThisWeek={setLoadingSectionReleasingThisWeek}
                setReleasingThisWeek={setReleasingThisWeek}
                setIndexPageReleasingThisWeek={setIndexPageReleasingThisWeek}
              />

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

              <NavButtons
                param='top-rated'
                section='MANGA'
                releasingThisWeek={releasingThisWeek}
                indexPageReleasingThisWeek={indexPageReleasingThisWeek}
                indexPageTopRated={indexPageTopRated}
                setIndexPageTopRated={setIndexPageTopRated}
                setLoadingSectionTopRated={setLoadingSectionTopRated}
                setTopRated={setTopRated}
                setLoadingSectionReleasingThisWeek={setLoadingSectionReleasingThisWeek}
                setReleasingThisWeek={setReleasingThisWeek}
                setIndexPageReleasingThisWeek={setIndexPageReleasingThisWeek}
              />


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

              <NavButtons
                param='releasing-this-week'
                section='ANIME'
                mediaFormat='MOVIE'
                releasingThisWeek={releasingThisWeek}
                indexPageReleasingThisWeek={indexPageReleasingThisWeek}
                indexPageTopRated={indexPageTopRated}
                setIndexPageTopRated={setIndexPageTopRated}
                setLoadingSectionTopRated={setLoadingSectionTopRated}
                setTopRated={setTopRated}
                setLoadingSectionReleasingThisWeek={setLoadingSectionReleasingThisWeek}
                setReleasingThisWeek={setReleasingThisWeek}
                setIndexPageReleasingThisWeek={setIndexPageReleasingThisWeek}
              />

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

              <NavButtons
                param='top-rated'
                section='ANIME'
                mediaFormat='MOVIE'
                releasingThisWeek={releasingThisWeek}
                indexPageReleasingThisWeek={indexPageReleasingThisWeek}
                indexPageTopRated={indexPageTopRated}
                setIndexPageTopRated={setIndexPageTopRated}
                setLoadingSectionTopRated={setLoadingSectionTopRated}
                setTopRated={setTopRated}
                setLoadingSectionReleasingThisWeek={setLoadingSectionReleasingThisWeek}
                setReleasingThisWeek={setReleasingThisWeek}
                setIndexPageReleasingThisWeek={setIndexPageReleasingThisWeek}
              />


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
