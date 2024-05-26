"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from 'swiper/modules';
import styles from "./component.module.css"
import MediaCoverCard from '@/app/components/MediaCards/MediaCover';
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface';

function RelatedMediaSwiperContainer({ data, options }: {
    data?: ApiDefaultResult[],
    options?: {
        slidesPerView?: number
        bp480: number,
        bp740: number,
        bp1275: number,
    }
}) {

    return (
        <Swiper
            className={styles.list_container}
            modules={[Navigation, Pagination, A11y]}
            slidesPerView={options?.slidesPerView || 3.4}
            spaceBetween={16}
            breakpoints={{
                480: { slidesPerView: options?.bp480 || 4.4 },
                740: { slidesPerView: options?.bp740 || 5.4 },
                1275: { slidesPerView: options?.bp1275 || 6.4 },
            }}
        >

            {data?.map((item, key: number) => (

                <SwiperSlide key={key} className="custom_swiper_list_item" role="listitem">

                    <MediaCoverCard positionIndex={key + 1} darkMode={true} mediaInfo={item as ApiDefaultResult} />
                 
                </SwiperSlide>

            ))}

        </Swiper>
    );
}

export default RelatedMediaSwiperContainer