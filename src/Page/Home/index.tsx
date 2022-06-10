import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'

export default function Home() {

  const [indexInnerPageLink, setIndexInnerPageLink] = useState(0)


  return (
    <C.Container innerPageLink={indexInnerPageLink}>

      <nav className='links'>

        <h3>Category</h3>

        <ul>

          <li><Link to={``}>Shonen</Link></li>
          <li><Link to={``}>Shojo</Link></li>
          <li><Link to={``}>Seinen</Link></li>
          <li><Link to={``}>Sports</Link></li>
          <li><Link to={``}>Action</Link></li>

        </ul>

        <h3>Discover</h3>

        <ul>

          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>

        </ul>

        <h3>Discover</h3>

        <ul>

          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>


        </ul>
      </nav>

      <div className='main-content'>

        <nav className='links-inner-page'>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(0)} className='anime'>Anime</Link>
          <Link to={`/`} onClick={() =>setIndexInnerPageLink(1)} className='manga'>Manga</Link>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(2)} className='movie'>Movie</Link>
        </nav>

        <section id='anime'>
          <div className='banner-most-watch'>
            a
          </div>

          <div className='new-episodes'>
            b
          </div>

          <div className='best-rated'>
            c
          </div>
        </section>

        <section id='manga'></section>
        
        <section id='movie'></section>
      </div>

      <aside className='trending'>
        aside
      </aside>

    </C.Container>

  )
}
