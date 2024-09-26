import React, { useEffect, useState } from "react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperClass } from "swiper/react";
import ChevronLeftIcon from "@/public/assets/chevron-left.svg";
import ChevronRightIcon from "@/public/assets/chevron-right.svg";
import styles from "./component.module.css";
import "swiper/css";
import "swiper/css/pagination";

type SwiperTypes = {
  children: React.ReactNode;
  title: string;
  daysSelected: number;
  breakpoint?: {
    slidesPerView?: number;
    bp480?: number;
    bp740?: number;
    bp1080?: number;
  };
};

function SwiperCarousel({
  children,
  title,
  daysSelected,
  breakpoint,
}: SwiperTypes) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    if (swiper?.activeIndex) swiper?.slideTo(0);
  }, [daysSelected, swiper != null]);

  return (
    <React.Fragment>
      <Swiper
        onSwiper={setSwiper}
        style={{ width: "inherit" }}
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={breakpoint?.slidesPerView || 2}
        spaceBetween={16}
        navigation={{
          nextEl: `.${title.replace(/\s/g, "-").toLowerCase()}-swiper-button-next`,
          prevEl: `.${title.replace(/\s/g, "-").toLowerCase()}-swiper-button-prev`,
        }}
        breakpoints={{
          480: { slidesPerView: breakpoint?.bp480 || 3 },
          740: { slidesPerView: breakpoint?.bp740 || 4 },
          1080: { slidesPerView: breakpoint?.bp1080 || 5 },
        }}
      >
        {children}
      </Swiper>

      <div id={styles.nav_title_buttons_container}>
        <h3>{title}</h3>

        <div
          id={styles.buttons_container}
          className="display_flex_row display_align_justify_center"
        >
          <button
            aria-label="Previous"
            className={`${title.replace(/\s/g, "-").toLowerCase()}-swiper-button-prev`}
          >
            <ChevronLeftIcon alt="Icon Facing Left" />
          </button>

          <button
            aria-label="Next"
            className={`${title.replace(/\s/g, "-").toLowerCase()}-swiper-button-next`}
          >
            <ChevronRightIcon alt="Icon Facing Right" />
          </button>
        </div>

        <span id={styles.line}></span>

        {/* <Link href={route} className='display_align_justify_center'>VIEW ALL <ChevronRightIcon alt="Icon Facing Right" /></Link> */}
      </div>
    </React.Fragment>
  );
}

export default SwiperCarousel;
