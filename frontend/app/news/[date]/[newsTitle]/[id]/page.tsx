import news from "@/app/api/consumet/consumetNews";
import { News, NewsArcticle } from "@/app/ts/interfaces/newsInterface";
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/app/news/components/NewsCard";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const newsInfo = (await news.getNewsInfo({ id: params.id })) as NewsArcticle;

  return {
    title: `${newsInfo ? newsInfo.title : "Error"} | AniProject`,
    description: newsInfo.intro,
  };
}

async function NewPage({ params }: { params: { id: string } }) {
  const newsInfo = (await news.getNewsInfo({ id: params.id })) as NewsArcticle;
  const recentNewsList = (await news.getNews({})) as News[];

  return (
    <main id={styles.container}>
      <article>
        <div id={styles.heading_container}>
          <h1>{newsInfo.title}</h1>

          <div id={styles.img_intro_container}>
            <div id={styles.img_container}>
              <Image
                src={newsInfo.thumbnail}
                alt={newsInfo.intro}
                fill
                sizes="(max-width: 440px) 100vw, 120px"
              />
            </div>

            <small>{newsInfo.intro}</small>
          </div>
        </div>

        <div id={styles.main_text_container}>
          <p>{newsInfo.description}</p>
        </div>

        <div id={styles.footer_container}>
          <small>
            Source:{" "}
            <Link href={newsInfo.url} target="_blank">
              Anime News Network
            </Link>
          </small>

          <small>
            {new Date(`${newsInfo.uploadedAt}`).toLocaleString("default", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </small>
        </div>
      </article>

      <div id={styles.other_news_container}>
        <ul>
          {recentNewsList.slice(0, 7).map((newsArticle, key) => (
            <li key={key}>
              <article>
                <NewsCard newsInfo={newsArticle} />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default NewPage;
