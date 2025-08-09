import React from "react";
import styles from "./component.module.css";

function ReviewRating({ ratingScore }: { ratingScore: number }) {
  function getBcgColorByRatingScore() {
    if (ratingScore >= 75) return "good";
    else if (ratingScore >= 50) return "medium";
    else if (ratingScore <= 49) return "bad";

    return "null";
  }

  const bcgComponentColor = getBcgColorByRatingScore();

  return (
    <div className={styles.rating_container} data-bcg-color={bcgComponentColor}>
      {ratingScore}/100
    </div>
  );
}

export default ReviewRating;
