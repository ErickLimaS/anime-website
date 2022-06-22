import React from 'react'
import * as C from './styles'
import { Link } from 'react-router-dom'

export default function CharacterAndActor(data: any) {

  console.log(data.data)

  return (
    <C.Container>

      {/* <div>
        <div className='img-character-actor'>
          <img src={`${data.data.node.image.large}`} alt={`${data.data.node.name.full}`} />
        </div>

        {data.data.node.name.full && (
          <h1>{data.data.node.name.full}</h1>
        )}
        {data.data.node.gender && (
          <p>{data.data.node.gender}</p>
        )}
        {data.data.node.age && (
          <p>{data.data.node.age}</p>
        )}

      </div>

      <div>
        <div className='img-character-actor'>
          <img src={`${data.data.voiceActors[0].image.large}`} alt={`${data.data.node.name.full}`} />
        </div>

        {data.data.voiceActors[0].name.full && (
          <h1>{data.data.voiceActors[0].name.full}</h1>
        )}
        {data.data.voiceActors[0].gender && (
          <p>{data.data.voiceActors[0].gender}</p>
        )}

        {data.data.voiceActors[0].age && (
          <p>{data.data.voiceActors[0].age}</p>
        )}

      </div> */}

      <div className='imgs'>
        <div className='img-character'>
          {data.data.node.image && (
            <img src={`${data.data.node.image.large}`} alt={`${data.data.node.name.full}`} />
          )}

          {data.data.node.name.full && (
            <h2>{data.data.node.name.full}</h2>
          )}
        </div>

        {/* <div className='span'>
          <span>
            X
          </span>
        </div> */}

        <div className='img-actor'>
          {data.data.voiceActors[0] && (
            <>{
              data.data.voiceActors[0].image && (
                <img src={`${data.data.voiceActors[0].image.large}`} alt={`${data.data.node.name.full}`} />
              )
            }

              {data.data.voiceActors[0].name.full && (
                <h2>{data.data.voiceActors[0].name.full}</h2>
              )}
            </>
          )}
        </div>

      </div>

      <div>

        <div className='character'>
          {data.data.node.gender && (
            <p>{data.data.node.gender}</p>
          )}
          {data.data.node.age && (
            <p>Age: {data.data.node.age}</p>
          )}
        </div>

        {data.data.voiceActors[0] && (
          <div className='actor'>
            {data.data.voiceActors[0].gender && (
              <p>{data.data.voiceActors[0].gender}</p>
            )}

            {data.data.voiceActors[0].age && (
              <p>Age: {data.data.voiceActors[0].age}</p>
            )}
          </div>
        )}
      </div>

    </C.Container>
  )
}
