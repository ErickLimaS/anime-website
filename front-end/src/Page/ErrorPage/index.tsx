import React, { useEffect, useState } from 'react'
import AsideNavLinks from '../../Components/Layout/AsideNavLinks'
import * as C from './styles'
import img from '../../imgs/error/sad-luffy.png'
import { Link } from 'react-router-dom'

export default function ErrorPage() {

    document.title = 'Error 404 | AniProject'

    const [clicks, setClicks] = useState(0)

    return (
        <C.Container>

            <AsideNavLinks />

            <div className='error'>

                <div className='error-message'>

                    <div>
                        {clicks >= 5 ? (
                            <h1>Created By <span>Erick Lima</span></h1>
                        ) : (
                            <h1>Error <span>404</span></h1>
                        )}

                        <p>It seems this page do not exist on our site.</p>

                        <Link to={`/`}>Return to Home</Link>

                    </div>

                    <img
                        src={img}
                        alt='Monkey D Luffy with a Sad Face'
                        onClick={() => setClicks((currClick) => currClick + 1)}
                    >

                    </img>

                </div>
            </div >

        </C.Container >
    )
}
