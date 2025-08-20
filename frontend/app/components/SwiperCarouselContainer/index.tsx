"use client";
import React from "react";
import { Swiper } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import styles from "./component.module.css";

type SwiperTypes = {
  children: React.ReactNode;
  options?: {
    slidesPerView?: number;
    bp480: number;
    bp740: number;
    bp1275: number;
  };
};

function SwiperCarouselContainer({ children, options }: SwiperTypes) {
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
      {children}
    </Swiper>
  );
}

export default SwiperCarouselContainer;
