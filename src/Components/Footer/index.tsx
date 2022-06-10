import React from 'react'
import * as C from './styles'

export default function Footer() {

    
  return (
    <C.Container>

      <div>
        <ul>
          <li>
          <a href='https://anilist.gitbook.io/anilist-apiv2-docs/' target='_blank' rel='noreferrer'>API Usada</a>
          </li>
        </ul>
      </div>

        <small>Site feito para <a href='https://erick-lima.netlify.app/' target='_blank' rel='noreferrer'>meu portfólio</a>.</small>

    </C.Container>
  )
}
