import React from 'react'
import * as C from './styles'
import { ReactComponent as StarSvg } from '../../imgs/svg/star.svg'
import { ReactComponent as StarFillSvg } from '../../imgs/svg/star-fill.svg'
import { ReactComponent as StarHalfSvg } from '../../imgs/svg/star-half.svg'

export default function Score(data: any) {

    return (
        <C.Container>
            {data.data === 50 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                </>
            )}
            {data.data >= 45 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                </>
            )}
            {data.data >= 40 && data.data < 45 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                </>
            )}
            {data.data >= 35 && data.data < 40 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                </>
            )}
            {data.data >= 30 && data.data < 35 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {data.data >= 25 && data.data < 30 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {data.data >= 20 && data.data < 25 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {data.data >= 15 && data.data < 20 && (
                <>
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {data.data >= 10 && data.data < 15 && (
                <>
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {data.data < 10 && (
                <>
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}


        </C.Container>
    )
}
