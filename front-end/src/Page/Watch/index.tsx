import React from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import * as C from './styles'

export default function Watch() {

  const [ id ] = useSearchParams()
  
  console.log(id.get('w'))

  return (
    <C.Container>

      <video width='80vh' height='70vh'>

      </video>


    </C.Container>
  )
}
