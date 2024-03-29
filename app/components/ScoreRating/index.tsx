import React from 'react'
import StarFill from "@/public/assets/star-fill.svg"
import StarHalf from "@/public/assets/star-half.svg"
import Star from "@/public/assets/star.svg"
import AnilistSvg from "@/public/assets/anilist.svg"
import ImdbSvg from "@/public/assets/imdb.svg"
import styles from "./component.module.css"

function ScoreRating({ score, type, source }: { score: number, type?: "stars" | "string", source?: "anilist" | "imdb" }) {

    return (
        <span className={styles.container} title={`${source} score: ${score} out of ${source == "anilist" ? "5" : "10"}`}>

            {source == "anilist" && (
                <span className={styles.source} style={{ background: "#1d252e" }}>
                    <AnilistSvg fill={"#02a9ff"} width={24} height={24} alt={"Anilist Icon"} title={'Anilist'} />
                </span>
            )}

            {source == "imdb" && (
                <span className={styles.source} style={{ background: "#e6b91e" }}>
                    <ImdbSvg fill={"#000000"} width={24} height={24} alt={"Imdb Icon"} title={'Imdb'} />
                </span>
            )}

            {/* STRING RATING TYPE */}
            {(type == "string") && (
                <p className={styles.rating_on_line}>{score}/10</p>
            )}


            {/* STARS RATING TYPE */}
            {/* 4 to 5 */}
            {((!type || type == "stars") && score == 5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score >= 4.5 && score < 5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score >= 4 && score < 4.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 3 to 4 */}
            {((!type || type == "stars") && score >= 3.5 && score < 4) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score >= 3 && score < 3.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 2 to 3 */}
            {((!type || type == "stars") && score >= 2.5 && score < 3) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score >= 2 && score < 2.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 1 to 2 */}
            {((!type || type == "stars") && score >= 1.5 && score < 2) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score > 1 && score < 1.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 0 to 1 */}
            {((!type || type == "stars") && score == 1) && (
                <>
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score >= 0.5 && score < 1) && (
                <>
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {((!type || type == "stars") && score > 0 && score < 0.5) && (
                <>
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

        </span>
    )

}

export default ScoreRating