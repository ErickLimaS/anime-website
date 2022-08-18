import React from 'react'
import { useSelector } from 'react-redux'
import * as C from './styles'

export default function CharacterAndActor(data: any) {
  
  // dark mode
  const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
  const { darkMode } = darkModeSwitch

  return (
    <C.Container darkMode={darkMode}>

      <div className='char-actor'>
        <div className='img-character'>
          {data.data.node.image && (
            <img src={`${data.data.node.image.large}`} alt={`${data.data.node.name.full}`} />
          )}

          {data.data.node.name.full && (
            <div className='names'>
              <h2>{data.data.node.name.full}</h2>
              <h2>{data.data.node.name.native}</h2>
            </div>
          )}
        </div>

        <div className='img-actor'>
          {data.data.voiceActors[0] && (
            <>{
              data.data.voiceActors[0].image && (
                <img src={`${data.data.voiceActors[0].image.large}`} alt={`${data.data.node.name.full}`} />
              )
            }

              {data.data.voiceActors[0].name.full && (
                <div className='names'>
                  <h2>{data.data.voiceActors[0].name.full}</h2>
                  <h2>{data.data.voiceActors[0].name.native}</h2>
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </C.Container>
  )
}
