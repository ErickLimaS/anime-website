import React from 'react'
import MovieSvg from "@/public/assets/film.svg"
import AnimeSvg from "@/public/assets/play-circle.svg"
import MangaSvg from "@/public/assets/book.svg"
import MusicSvg from "@/public/assets/music-note-beamed.svg"
import OtherSvg from "@/public/assets/three-dots.svg"

function MediaFormatIcon({ format }: { format: string }) {

    if (format == "OVA" || format == "TV" || format == "ONA" || format == "SPECIAL") {

        return (<AnimeSvg width={16} height={16} alt="Tv Icon" />)

    }
    else if (format == "MOVIE") {

        return (<MovieSvg width={16} height={16} alt="Movie Icon" />)

    }
    else if (format == "MANGA") {

        return (<MangaSvg width={16} height={16} alt="Manga Icon" />)

    }
    else if (format == "MUSIC") {

        return (<MusicSvg width={16} height={16} alt="Music Icon" />)

    }
    else {

        return (<OtherSvg width={16} height={16} alt="Other Icon" />)

    }

}

export default MediaFormatIcon