import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import styles from "./component.module.css"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'

function ListCarousel({ data, className }: { data: ApiDefaultResult, className?: string }) {
    return (
        <li className={styles.container}>
            <Link href={`/media/${data.id}`}>
                <Image
                    src={data.bannerImage}
                    alt={`Cover for ${data.title.romaji}`}
                    fill
                    sizes='(max-width: 1199px) 45vw, 15vw'
                />
            </Link>
        </li>
    )
}

export default ListCarousel