"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import Link from "next/link";
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg";
import news from "@/app/api/consumet/consumetNews";
import { News } from "@/app/ts/interfaces/newsInterface";
import SvgCalendar from "@/public/assets/calendar3.svg";
import Image from "next/image";
import ErrorPlaceholder from "../ErrorPlaceholder";

function NewsNavListHover() {
  const [newsList, setNewsList] = useState<News[] | null>([]);

  useEffect(() => {
    fetchRecentNews();
  }, []);

  const fetchRecentNews = async () => {
    const recentNews = (await news.getNews({})) as News[];

    setNewsList(recentNews);
  };

  function replaceInvalidNewsIdOnUrl(newsId: string) {
    return newsId.replace(/\/?daily-briefs\//, "");
  }

  if (!newsList) {
    return <ErrorPlaceholder />;
  }

  return (
    <div id={styles.news_header_nav_container}>
      <div className={styles.link_container}>
        <Link href={`/news`}>Go to News Page</Link>
      </div>

      <ul data-loading={newsList.length == 0}>
        {newsList.length == 0 && (
          <LoadingSvg width={200} height={200} alt="Loading" />
        )}

        {newsList &&
          newsList.slice(0, 10).map((news, key) => (
            <li key={key}>
              <div className={styles.image_container}>
                <Link href={`/news/${replaceInvalidNewsIdOnUrl(news.id)}`}>
                  <Image
                    src={news.thumbnail}
                    alt={news.title}
                    fill
                    sizes="(max-width: 1439px) 15vw, 231px"
                  />
                </Link>
              </div>

              <div className={styles.title_container}>
                <h5>
                  <Link href={`/news/${replaceInvalidNewsIdOnUrl(news.id)}`}>
                    {news.title}
                  </Link>
                </h5>

                <small>
                  <SvgCalendar width={16} height={16} alt="Calendar" />{" "}
                  {news.uploadedAt}
                </small>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default NewsNavListHover;
