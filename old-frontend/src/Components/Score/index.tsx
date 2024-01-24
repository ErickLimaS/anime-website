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
                    <span>
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                    </span>
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 45 && score < 49 && (
                <>
                    <span>
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarHalfSvg />
                    </span>
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 40 && score < 45 && (
                <>
                    <span>
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarSvg />
                    </span>
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )}
            {score >= 35 && score < 40 && (
                <>
                    <span>
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarFillSvg />
                        <StarHalfSvg />
                        <StarSvg />
                    </span>
                    <small>({(score / 10).toFixed(2)})</small>
                </>
            )
            }
            {
                score >= 30 && score < 35 && (
                    <>
                        <span>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarSvg />
                            <StarSvg />
                        </span>
                        <small>({(score / 10).toFixed(2)})</small>
                    </>
                )
            }
            {
                score >= 25 && score < 30 && (
                    <>
                        <span>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarHalfSvg />
                            <StarSvg />
                            <StarSvg />
                        </span>
                        <small>({(score / 10).toFixed(2)})</small>
                    </>
                )
            }
            {
                score >= 20 && score < 25 && (
                    <>
                        <span>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </span>
                        <small>({(score / 10).toFixed(2)})</small>
                    </>
                )
            }
            {
                score >= 15 && score < 20 && (
                    <>
                        <span>
                            <StarFillSvg />
                            <StarHalfSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </span>
                        <small>({(score / 10).toFixed(2)})</small>
                    </>
                )
            }
            {
                score >= 10 && score < 15 && (
                    <>
                        <span>
                            <StarFillSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </span>
                        <small>({(score / 10).toFixed(2)})</small>
                    </>
                )
            }
            {
                score < 10 && (
                    <>
                        <span>
                            <StarHalfSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </span>
                        <small>({(score / 10).toFixed(2)})</small>
                    </>
                )
            }


        </C.Container >
    )
}
