"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import styles from "./component.module.css";
import * as MediaCard from "@/app/components/MediaCards/MediaCard";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";

function MediaRelatedContainer({
  mediaList,
  swiperOptions,
}: {
  mediaList?: MediaData[];
  swiperOptions?: {
    slidesPerView?: number;
    bp480: number;
    bp740: number;
    bp1275: number;
  };
}) {
  return (
    <Swiper
      className={styles.list_container}
      modules={[Navigation, Pagination, A11y]}
      slidesPerView={swiperOptions?.slidesPerView || 3.4}
      spaceBetween={16}
      breakpoints={{
        480: { slidesPerView: swiperOptions?.bp480 || 4.4 },
        740: { slidesPerView: swiperOptions?.bp740 || 5.4 },
        1275: { slidesPerView: swiperOptions?.bp1275 || 6.4 },
      }}
    >
      {mediaList?.map((media, key) => (
        <SwiperSlide
          key={key}
          className="custom_swiper_list_item"
          role="listitem"
        >
          <MediaCard.Container key={key} positionIndex={key + 1} onDarkMode>
            <MediaCard.MediaImgLink
              hideOptionsButton
              mediaId={media.id}
              mediaInfo={media}
              title={media.title.userPreferred || media.title.romaji}
              formatOrType={media.format}
              url={media.coverImage.large}
            />

            <MediaCard.SmallTag
              seasonYear={media.seasonYear}
              tags={media.genres[0]}
            />

            <MediaCard.LinkTitle
              title={media.title.userPreferred || media.title.romaji}
              id={media.id}
            />
          </MediaCard.Container>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default MediaRelatedContainer;
