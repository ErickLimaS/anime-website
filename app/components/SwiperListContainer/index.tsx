"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import MediaItemCoverInfo from '../MediaItemCoverInfo';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import styles from "./styles.module.css"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface';
import ListCarousel from '../HomePage/HeroListCarousel';

function SwiperListContainer({ data, options, customHeroSection }: {
    data?: ApiDefaultResult[],
    options?: {
        slidesPerView?: number
        bp480: number,
        bp740: number,
        bp1275: number,
    },
    customHeroSection?: boolean
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

                <SwiperSlide key={key} className={styles.custom_list_item} role="listitem">
                    {customHeroSection ? (
                        <ListCarousel data={item} />
                    ) : (
                        <MediaItemCoverInfo positionIndex={key + 1} darkMode={true} data={item} />
                    )}
                </SwiperSlide>

            ))}

        </Swiper>
    );
}

export default SwiperListContainer