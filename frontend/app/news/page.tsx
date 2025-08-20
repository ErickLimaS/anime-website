import { Metadata } from "next";
import React from "react";
import styles from "./page.module.css";
import newsApi from "@/app/api/consumet/consumetNews";
import Image from "next/image";
import Link from "next/link";
import NewsSwiperContainer from "./components/NewsSwiperContainer";
import SvgCalendar from "@/public/assets/calendar3.svg";
import { News } from "../ts/interfaces/newsInterface";
import NewsCard from "./components/NewsCard";

export const revalidate = 1800; // revalidate cached data every 30 min

export const metadata: Metadata = {
  title: "News | AniProject",
  description:
    "See the latest news about a variety of animes, mangas and movies.",
};

async function NewsHomePage() {
  const recentNewsList = (await newsApi.getNews({})) as News[];

  const animesNewsList = (await newsApi.getNews({ topic: "anime" })) as News[];
  const mangasNewsList = (await newsApi.getNews({ topic: "manga" })) as News[];
  const gamesNewsList = (await newsApi.getNews({ topic: "games" })) as News[];
  const industryNewsList = (await newsApi.getNews({
    topic: "industry",
  })) as News[];

  return (
    recentNewsList &&
    mangasNewsList &&
    gamesNewsList &&
    industryNewsList && (
      <main id={styles.container}>
        <h1>TRENDING NOW</h1>

        <section id={styles.highlight}>
          <div id={styles.highlighted_news}>
            <div id={styles.main_news}>
              <div className={styles.image_container}>
                <Image
                  src={recentNewsList[0]?.thumbnail || ""}
                  alt={recentNewsList[0].title}
                  fill
                  sizes="(max-width: 529px) 100vw, (max-width: 1019px) 40vw, (max-width: 1019px) 35vw, (max-width: 1259px) 30vw, 289px"
                />
              </div>

              <div className={styles.highlight_title}>
                {recentNewsList[0]?.topics[0] && (
                  <Link
                    className={styles.topic}
                    href={`/news?topic=${recentNewsList[0].topics[0]}`}
                  >
                    {recentNewsList[0].topics[0].toUpperCase()}
                  </Link>
                )}

                <h2>
                  <Link
                    href={`/news/${recentNewsList[0].id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    {recentNewsList[0].title}
                  </Link>
                </h2>
              </div>
            </div>

            <div id={styles.news_second}>
              {recentNewsList.slice(1, 4).map((newsArticle, key) => (
                <div className={styles.hero_news_container} key={key}>
                  <div className={styles.image_container}>
                    <Link
                      href={`/news/${newsArticle.id.replace(
                        /\/?daily-briefs\//,
                        ""
                      )}`}
                    >
                      <Image
                        src={newsArticle.thumbnail}
                        alt={newsArticle.title}
                        fill
                        sizes="(max-width: 1020px) 33vw, (max-width: 1259px) 11vw, 239px"
                      />
                    </Link>
                  </div>

                  <div className={styles.highlight_title}>
                    {recentNewsList[0]?.topics[0] && (
                      <Link
                        className={styles.topic}
                        href={`/news?topic=${newsArticle.topics[0]}`}
                      >
                        {newsArticle.topics[0].toUpperCase()}
                      </Link>
                    )}

                    <h2>
                      <Link
                        href={`/news/${newsArticle.id.replace(
                          /\/?daily-briefs\//,
                          ""
                        )}`}
                      >
                        {newsArticle.title}
                      </Link>
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id={styles.hero_news_list}>
            {recentNewsList.slice(4, 9).map((newsArticle, key) => (
              <NewsCard key={key} newsInfo={newsArticle} />
            ))}
          </div>
        </section>

        <section id={styles.animes_container}>
          <h2>Recent Animes News</h2>

          <NewsSwiperContainer
            newsList={animesNewsList}
            options={{
              slidesPerView: 1.2,
              bp480: 2.2,
              bp740: 3.2,
              bp1275: 3.2,
            }}
          />
        </section>

        <section id={styles.manga_games_industry_container}>
          <div className={styles.list_container}>
            <h2>MANGAS</h2>

            <div className={styles.highlighted_container}>
              <div className={styles.image_container}>
                <Link
                  href={`/news/${mangasNewsList[0].id.replace(
                    /\/?daily-briefs\//,
                    ""
                  )}`}
                >
                  <Image
                    src={mangasNewsList[0].thumbnail || ""}
                    alt={mangasNewsList[0].title}
                    fill
                    sizes="(max-width: 599px) 100vw, (max-width: 1259px) 33vw, 379px"
                  />
                </Link>
              </div>

              <div className={styles.highlight_title}>
                {recentNewsList[0]?.topics[0] && (
                  <Link
                    className={styles.topic}
                    href={`/news?topic=${mangasNewsList[0].topics[0]}`}
                  >
                    {mangasNewsList[0].topics[0].toUpperCase()}
                  </Link>
                )}

                <h2>
                  <Link
                    href={`/news/${mangasNewsList[0].id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    {mangasNewsList[0].title}
                  </Link>
                </h2>
              </div>
            </div>

            {mangasNewsList.slice(1, 6).map((newsArticle, key) => (
              <div className={styles.item_container} key={key}>
                <div className={styles.image_container}>
                  <Link
                    href={`/news/${newsArticle.id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    <Image
                      src={newsArticle.thumbnail || ""}
                      alt={newsArticle.title}
                      fill
                      sizes="(max-width: 599px) 40vw, (max-width: 1259px) 15vw, 133px"
                    />
                  </Link>
                </div>

                <div
                  className={`${styles.highlight_title} ${styles.item_title_container}`}
                >
                  <h2>
                    <Link
                      href={`/news/${newsArticle.id.replace(
                        /\/?daily-briefs\//,
                        ""
                      )}`}
                    >
                      {newsArticle.title}
                    </Link>
                  </h2>

                  {newsArticle.uploadedAt && (
                    <small>
                      <SvgCalendar width={16} height={16} alt={"Calendar"} />
                      {newsArticle.uploadedAt}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.list_container}>
            <h2>GAMES</h2>

            <div className={styles.highlighted_container}>
              <div className={styles.image_container}>
                <Link
                  href={`/news/${gamesNewsList[0].id.replace(
                    /\/?daily-briefs\//,
                    ""
                  )}`}
                >
                  <Image
                    src={gamesNewsList[0].thumbnail || ""}
                    alt={gamesNewsList[0].title}
                    fill
                    sizes="(max-width: 599px) 100vw, (max-width: 1259px) 33vw, 379px"
                  />
                </Link>
              </div>

              <div className={styles.highlight_title}>
                {recentNewsList[0]?.topics[0] && (
                  <Link
                    className={styles.topic}
                    href={`/news?topic=${gamesNewsList[0].topics[0]}`}
                  >
                    {gamesNewsList[0].topics[0].toUpperCase()}
                  </Link>
                )}

                <h2>
                  <Link
                    href={`/news/${gamesNewsList[0].id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    {gamesNewsList[0].title}
                  </Link>
                </h2>
              </div>
            </div>

            {gamesNewsList.slice(1, 6).map((newsArticle, key) => (
              <div className={styles.item_container} key={key}>
                <div className={styles.image_container}>
                  <Link
                    href={`/news/${newsArticle.id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    <Image
                      src={newsArticle.thumbnail || ""}
                      alt={newsArticle.title}
                      fill
                      sizes="(max-width: 599px) 40vw, (max-width: 1259px) 15vw, 133px"
                    />
                  </Link>
                </div>

                <div
                  className={`${styles.highlight_title} ${styles.item_title_container}`}
                >
                  <h2>
                    <Link
                      href={`/news/${newsArticle.id.replace(
                        /\/?daily-briefs\//,
                        ""
                      )}`}
                    >
                      {newsArticle.title}
                    </Link>
                  </h2>

                  {newsArticle.uploadedAt && (
                    <small>
                      <SvgCalendar width={16} height={16} alt={"Calendar"} />
                      {newsArticle.uploadedAt}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.list_container}>
            <h2>INDUSTRY</h2>

            <div className={styles.highlighted_container}>
              <div className={styles.image_container}>
                <Link
                  href={`/news/${industryNewsList[0].id.replace(
                    /\/?daily-briefs\//,
                    ""
                  )}`}
                >
                  <Image
                    src={industryNewsList[0].thumbnail || ""}
                    alt={industryNewsList[0].title}
                    fill
                    sizes="(max-width: 599px) 100vw, (max-width: 1259px) 33vw, 379px"
                  />
                </Link>
              </div>

              <div className={styles.highlight_title}>
                {recentNewsList[0]?.topics[0] && (
                  <Link
                    className={styles.topic}
                    href={`/news?topic=${industryNewsList[0].topics[0]}`}
                  >
                    {industryNewsList[0].topics[0].toUpperCase()}
                  </Link>
                )}

                <h2>
                  <Link
                    href={`/news/${industryNewsList[0].id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    {industryNewsList[0].title}
                  </Link>
                </h2>
              </div>
            </div>

            {industryNewsList.slice(1, 6).map((newsArticle, key) => (
              <div className={styles.item_container} key={key}>
                <div className={styles.image_container}>
                  <Link
                    href={`/news/${newsArticle.id.replace(
                      /\/?daily-briefs\//,
                      ""
                    )}`}
                  >
                    <Image
                      src={newsArticle.thumbnail || ""}
                      alt={newsArticle.title}
                      fill
                      sizes="(max-width: 599px) 40vw, (max-width: 1259px) 15vw, 133px"
                    />
                  </Link>
                </div>

                <div
                  className={`${styles.highlight_title} ${styles.item_title_container}`}
                >
                  <h2>
                    <Link
                      href={`/news/${newsArticle.id.replace(
                        /\/?daily-briefs\//,
                        ""
                      )}`}
                    >
                      {newsArticle.title}
                    </Link>
                  </h2>

                  {newsArticle.uploadedAt && (
                    <small>
                      <SvgCalendar width={16} height={16} alt={"Calendar"} />
                      {newsArticle.uploadedAt}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    )
  );
}

export default NewsHomePage;
