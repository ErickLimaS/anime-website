import React from 'react'
import StarFill from "@/public/assets/star-fill.svg"
import StarHalf from "@/public/assets/star-half.svg"
import Star from "@/public/assets/star.svg"
import AnilistSvg from "@/public/assets/anilist.svg"
import styles from "./component.module.css"

function ScoreInStars({ score, source }: { score: number, source?: "anilist" }) {

    return (
        <span
            title={"Score: " + score + " out of 5"}
            className={styles.container}
        >

            {source == "anilist" && (
                <span className={styles.source}>
                    <AnilistSvg fill={"#02a9ff"} width={24} height={24} alt={"Anilist Icon"} title={'Anilist'} /> Anilist
                </span>
            )}

            {/* 4 to 5 */}
            {(score == 5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                </>
            )}

            {(score >= 4.5 && score < 5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                </>
            )}

            {(score >= 4 && score < 4.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 3 to 4 */}
            {(score >= 3.5 && score < 4) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {(score >= 3 && score < 3.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 2 to 3 */}
            {(score >= 2.5 && score < 3) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {(score >= 2 && score < 2.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 1 to 2 */}
            {(score >= 1.5 && score < 2) && (
                <>
                    <StarFill width={16} height={16} />
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {(score > 1 && score < 1.5) && (
                <>
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {/* 0 to 1 */}
            {(score == 1) && (
                <>
                    <StarFill width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {(score >= 0.5 && score < 1) && (
                <>
                    <StarHalf width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                    <Star width={16} height={16} />
                </>
            )}

            {(score > 0 && score < 0.5) && (
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

export default ScoreInStars