import React from "react";
import MovieSvg from "@/public/assets/film.svg";
import AnimeSvg from "@/public/assets/play-circle.svg";
import MangaSvg from "@/public/assets/book.svg";
import MusicSvg from "@/public/assets/music-note-beamed.svg";
import OtherSvg from "@/public/assets/three-dots.svg";

function MediaFormatIcon({
  format,
}: {
  format: "OVA" | "TV" | "ONA" | "SPECIAL" | "MOVIE" | "MANGA" | "MUSIC";
}) {
  switch (format) {
    case "OVA":
    case "TV":
    case "ONA":
    case "SPECIAL":
      return <AnimeSvg width={16} height={16} alt="Tv Icon" />;

    case "MOVIE":
      return <MovieSvg width={16} height={16} alt="Movie Icon" />;

    case "MANGA":
      return <MangaSvg width={16} height={16} alt="Manga Icon" />;

    case "MUSIC":
      return <MusicSvg width={16} height={16} alt="Music Icon" />;

    default:
      return <OtherSvg width={16} height={16} alt="Other Icon" />;
  }
}

export default MediaFormatIcon;
