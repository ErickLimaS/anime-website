import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'

export default function AnimesReleasingThisWeek(data: any) {

    return (

        <C.AnimeToBeListed info={data.data} >
            <div className='add-button'>
                <button type='button' onClick={() => console.log(data.data)}><PlusSvg /></button>
            </div>
            <div className='see-more-button'>
                <Link to={`/anime/${data.data.id}`}>See More</Link>
            </div>
        </C.AnimeToBeListed>
    )
}
