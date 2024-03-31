"use client"
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import React from 'react'
import styled from 'styled-components'

function BcgImgBanner({ mediaData, bcgForDesktop }: { mediaData: ApiMediaResults, bcgForDesktop: any }) {

    const BcgImgBanner = styled.div`

        background: linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${mediaData?.coverImage?.extraLarge});
        
        @media (min-width: 620px) {
        
            background: linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${bcgForDesktop});

        }

        background-position: 100% 30% !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;

        min-height: 400px;
        height: calc(400px + 5vw);
        max-height: 60vh;

    `

    return (
        <BcgImgBanner />
    )
}

export default BcgImgBanner