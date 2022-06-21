import React from 'react'
import * as C from './styles'
import { ReactComponent as StarSvg } from '../../imgs/svg/star.svg'
import { ReactComponent as StarFillSvg } from '../../imgs/svg/star-fill.svg'
import { ReactComponent as StarHalfSvg } from '../../imgs/svg/star-half.svg'

export default function Score(data: any) {

    const score = data.data / 2

    return (
        <C.Container>
            {score === 50 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                </>
            )}
            {score >= 45 && score < 50 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                </>
            )}
            {score >= 40 && score < 45 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                </>
            )}
            {score >= 35 && score < 40 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                </>
            )}
            {score >= 30 && score < 35 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {score >= 25 && score < 30 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {score >= 20 && score < 25 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {score >= 15 && score < 20 && (
                <>
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {score >= 10 && score < 15 && (
                <>
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                </>
            )}
            {score < 10 && (
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
