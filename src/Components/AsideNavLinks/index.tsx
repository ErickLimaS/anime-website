import React from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'

export default function AsideNavLinks() {


  return (
    <C.Container>

      <h3>Category</h3>

      <ul>

        <li><Link to={``}>Shonen</Link></li>
        <li><Link to={``}>Shojo</Link></li>
        <li><Link to={``}>Seinen</Link></li>
        <li><Link to={``}>Sports</Link></li>
        <li><Link to={``}>Action</Link></li>

      </ul>

      <h3>Categories</h3>

      <ul>

        <li><Link to={``}>Tv</Link></li>
        <li><Link to={``}>Manga</Link></li>
        <li><Link to={``}>One Shot</Link></li>
        <li><Link to={``}>Novel</Link></li>
        <li><Link to={``}>Movie</Link></li>
        <li><Link to={``}>Special</Link></li>
        <li><Link to={``}>OVA</Link></li>

      </ul>

      <h3>General</h3>

      <ul>

        <li><Link to={``}>Settings</Link></li>
        <li><Link to={``}>Log Out</Link></li>


      </ul>
    </C.Container>
  )
}
