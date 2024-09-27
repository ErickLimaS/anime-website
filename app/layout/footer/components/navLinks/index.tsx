import Link from "next/link";
import React, { Suspense } from "react";
import animesGenres from "@/app/data/animeGenres.json";
import styles from "../../footerComponent.module.css";
import AiringThisWeek from "./airingThisWeek";

function NavLinks() {
  return (
    <div id={styles.nav_links_container}>
      <div className={styles.list_container}>
        <h5>Categories</h5>

        <ul className={`${styles.grid_template} display_grid`}>
          {animesGenres.map((media) => (
            <li key={media.value}>
              <Link href={`/search?genre=[${media.value}]`}>{media.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <Suspense
        fallback={
          <div className={`${styles.list_container} ${styles.placeholder}`}>
            <span className={styles.heading_placeholder}></span>

            <ul
              className={`${styles.grid_template} ${styles.list_placeholder} display_grid`}
            >
              {Array.from({ length: 11 - (0 + 1) }, (_, i) => i).map((key) => (
                <li key={key} className={styles.list_item_placeholder}></li>
              ))}
            </ul>
          </div>
        }
      >
        <AiringThisWeek />
      </Suspense>

      <div className="display_flex_row">
        <span id={styles.span_border2}></span>

        <div id={styles.div_custom_margin}>
          <h5>About</h5>

          <ul>
            <li>
              <Link
                href="https://github.com/ErickLimaS/anime-website/"
                target="_blank"
              >
                This Project
              </Link>
            </li>

            {/* What about leave a link to the creator's repository? /}
                {/* 😊 */}
            {/* 
                <li>
                  <Link
                    href="https://github.com/ErickLimaS/anime-website/"
                    target="_blank"
                  >
                    Forked From ErickLimaS
                  </Link>
                </li> 
            */}

            <li>
              <Link
                href="https://anilist.gitbook.io/anilist-apiv2-docs/"
                target="_blank"
              >
                AniList API
              </Link>
            </li>
            <li>
              <Link href="https://docs.consumet.org/" target="_blank">
                Consumet API
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/ghoshRitesh12/aniwatch-api"
                target="_blank"
              >
                Aniwatch API
              </Link>
            </li>
            {/* REMOVE THE ITEM BELLOW IF YOU FORKED THIS PROJECT */}
            <li>
              <Link
                href="https://www.fiverr.com/erick_limas/create-a-responsive-landpage-using-react-next-js-javascript-or-typescript"
                target="_blank"
              >
                Want a website?
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavLinks;
