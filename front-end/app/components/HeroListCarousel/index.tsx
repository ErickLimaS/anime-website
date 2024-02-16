import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import styles from "./component.module.css"

function ListCarousel({ data }: any) {
    return (
        <li className={styles.container}>
            <Link href={`/media/${data.id}`}>
                <Image src={data.bannerImage} alt={`Cover for ${data.title.romaji}`} fill sizes='100%' />
            </Link>
        </li>
    )
}

export default ListCarousel