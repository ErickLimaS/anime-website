"use client"
import React from 'react'
import ReactPlayer from 'react-player';
import { TrackProps } from 'react-player/file';

function Player({ source, subtitles }: { source: string, subtitles?: { kind: string, default: boolean | undefined, file: string, label: string }[] }) {

    const subList: TrackProps[] | undefined = []

    subtitles?.map((item, key) => (
        subList.push({
            kind: subtitles[key].kind,
            srcLang: subtitles[key].label,
            src: subtitles[key].file,
            default: subtitles[key].default,
            label: subtitles[key].label
        })
    ))

    return (
        <ReactPlayer
            controls
            playing
            volume={0.6}
            url={source}
            config={{
                file: {
                    attributes: {
                        crossOrigin: "anonymous",
                    },
                    tracks: subList
                }
            }}
        />
    )
}

export default Player