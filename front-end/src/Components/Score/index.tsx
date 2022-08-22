import React from 'react'
import * as C from './styles'
import { ReactComponent as StarSvg } from '../../imgs/svg/star.svg'
import { ReactComponent as StarFillSvg } from '../../imgs/svg/star-fill.svg'
import { ReactComponent as StarHalfSvg } from '../../imgs/svg/star-half.svg'
import { useSelector } from 'react-redux'

export default function Score(data: any) {

    const score: number = data.data / 2

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    return (
        <C.Container
            darkMode={darkMode}
        >
            {score >= 49 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 45 && score < 49 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 40 && score < 45 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 35 && score < 40 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 30 && score < 35 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 25 && score < 30 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 20 && score < 25 && (
                <>
                    <StarFillSvg />
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 15 && score < 20 && (
                <>
                    <StarFillSvg />
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 10 && score < 15 && (
                <>
                    <StarFillSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score < 10 && (
                <>
                    <StarHalfSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <StarSvg />
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}


        </C.Container>
    )
}
