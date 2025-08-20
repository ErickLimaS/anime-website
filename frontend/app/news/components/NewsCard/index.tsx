import Link from "next/link";
import React from "react";
import styles from "./component.module.css";
import Image from "next/image";
import { News } from "@/app/ts/interfaces/newsInterface";

function NewsCard({ newsInfo }: { newsInfo: News }) {
  return (
    <div className={styles.hero_news_container}>
      <div className={styles.image_container}>
        <Link href={`/news/${newsInfo.id.replace(/\/?daily-briefs\//, "")}`}>
          <Image
            src={newsInfo.thumbnail}
            alt={newsInfo.title}
            fill
            sizes="(max-width: 1020px) 25vw, (max-width: 1259px) 10vw, 94px"
          />
        </Link>
      </div>

      <div className={styles.highlight_title}>
        {newsInfo.topics[0] && (
          <Link
            className={styles.topic}
            href={`/news?topic=${newsInfo.topics[0]}`}
          >
            {newsInfo.topics[0].toUpperCase()}
          </Link>
        )}

        <h2>
          <Link href={`/news/${newsInfo.id.replace(/\/?daily-briefs\//, "")}`}>
            {newsInfo.title}
          </Link>
        </h2>
      </div>
    </div>
  );
}

export default NewsCard;
