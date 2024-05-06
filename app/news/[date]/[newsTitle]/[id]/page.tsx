import news from '@/app/api/consumetNews'
import { News, NewsArcticle } from '@/app/ts/interfaces/newsInterface'
import React from 'react'
import styles from "./page.module.css"
import Link from 'next/link'
import Image from 'next/image'
import NewsCard from '@/app/news/components/NewsCard'

export async function generateMetadata({ params }: { params: { id: string } }) {

    const newsData = await news.getNewsInfo(params.id) as NewsArcticle

    return {
        title: `${newsData.title} | AniProject`,
        description: newsData.intro,
    }
}

async function NewPage({ params }: { params: { id: string } }) {

    const newsData = await news.getNewsInfo(params.id) as NewsArcticle
    const otherNews = await news.getNews() as News[]

    return (
        <main id={styles.container}>

            <article>

                <div id={styles.heading_container}>

                    <h1>{newsData.title}</h1>

                    <div id={styles.img_intro_container}>

                        <div id={styles.img_container}>
                            <Image
                                src={newsData.thumbnail}
                                alt={newsData.intro}
                                fill
                                sizes='(max-width: 440px) 100vw, 120px'
                            />
                        </div>

                        <small>{newsData.intro}</small>

                    </div>

                </div>

                <div id={styles.main_text_container}>

                    <p>{newsData.description}</p>

                </div>

                <div id={styles.footer_container}>

                    <small>Source: <Link href={newsData.url} target='_blank'>Anime News Network</Link></small>

                    <small>
                        {new Date(`${newsData.uploadedAt}`).toLocaleString(
                            'default',
                            { month: 'long', day: "numeric", year: "numeric", hour: 'numeric', minute: '2-digit' }
                        )}
                    </small>

                </div>

            </article>

            <div id={styles.other_news_container}>

                <ul>
                    {otherNews.slice(0, 7).map((item, key) => (

                        <li key={key} >
                            <article>
                                <NewsCard data={item} />
                            </article>
                        </li>

                    ))}
                </ul>

            </div>

        </main>
    )
}

export default NewPage