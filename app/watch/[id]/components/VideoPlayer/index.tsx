"use client"
import Hls from 'hls.js'
import React from 'react'
import VPlayer from 'vnetwork-player'
import 'vnetwork-player/dist/vnetwork-player.min.css';
import { Subtitle } from 'vnetwork-player/dist/utils/types'

function Player({ source, subtitles }: { source: string, subtitles?: { file: string, label: string }[] }) {

    const subList: Subtitle[] | undefined = []

    subtitles?.map((item, key) => (
        subList.push({
            lang: subtitles[key].label,
            url: subtitles[key].file
        })
    ))
    
    return (
        <VPlayer
            source={source}
            color="var(--brand-color)"
            subtitle={subList}
            Hls={Hls}
        />
    )
}

export default Player