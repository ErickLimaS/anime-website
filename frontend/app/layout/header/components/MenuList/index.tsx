"use client";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./component.module.css";
import MenuListSvg from "@/public/assets/list.svg";
import ChevronUpIcon from "@/public/assets/chevron-up.svg";
import ChevronDownIcon from "@/public/assets/chevron-down.svg";
import { AnimatePresence, motion } from "framer-motion";
import animesGenres from "@/app/data/animeGenres.json";

const framerMotionShowUpMotion = {
  hidden: {
    x: "-100vw",
    opacity: 0,
  },
  visible: {
    x: "0",
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    x: "-100vw",
    opacity: 0,
  },
};

function MenuList() {
  // FOR MOBILE SCREENS
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isListOneExpanded, setIsListOneExpanded] = useState<boolean>(false);
  const [isListTwoExpanded, setIsListTwoExpanded] = useState<boolean>(false);

  return (
    <div id={styles.menu_container}>
      <button
        id={styles.btn_open_menu}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-controls={styles.menu_list}
        aria-label={isMenuOpen ? "Click to Close Menu" : "Click to Open Menu"}
        className={styles.heading_btn}
      >
        <MenuListSvg alt="Menu Icon" width={16} height={16} />
      </button>

      <AnimatePresence initial={false} mode="wait">
        {isMenuOpen && (
          <motion.div
            variants={framerMotionShowUpMotion}
            data-disabled-scroll={true}
            initial="hidden"
            animate="visible"
            exit="exit"
            id={styles.menu_list}
            aria-expanded={isMenuOpen}
          >
            <ul role="menu">
              <li role="menuitem">
                <h5
                  className="display_flex_row align_items_center"
                  data-opened={isListOneExpanded}
                  onClick={() => setIsListOneExpanded(!isListOneExpanded)}
                >
                  Animes
                  {!isListOneExpanded ? (
                    <ChevronDownIcon
                      alt="Close Animes List"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <ChevronUpIcon
                      alt="Open Animes List"
                      width={16}
                      height={16}
                    />
                  )}
                </h5>

                <ul data-visible={isListOneExpanded}>
                  {animesGenres.map((genre) => (
                    <li key={genre.value} onClick={() => setIsMenuOpen(false)}>
                      <Link href={`/search?type=tv&genre=[${genre.value}]`}>
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li role="menuitem">
                <h5
                  className="display_flex_row align_items_center"
                  data-opened={isListTwoExpanded}
                  onClick={() => setIsListTwoExpanded(!isListTwoExpanded)}
                >
                  Mangas
                  {!isListTwoExpanded ? (
                    <ChevronDownIcon
                      alt="Close Mangas List"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <ChevronUpIcon
                      alt="Open Mangas List"
                      width={16}
                      height={16}
                    />
                  )}
                </h5>

                <ul data-visible={isListTwoExpanded}>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&sort=trending_desc`}>
                      Trending
                    </Link>
                  </li>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&sort=releases_desc`}>
                      Lastest Releases
                    </Link>
                  </li>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&genre=[shounen]`}>
                      Shounen
                    </Link>
                  </li>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&genre=[drama]`}>
                      Genre: Drama
                    </Link>
                  </li>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&genre=[slice-of-life]`}>
                      Genre: Slice of Life
                    </Link>
                  </li>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&genre=[comedy]`}>
                      Genre: Comedy
                    </Link>
                  </li>
                  <li onClick={() => setIsMenuOpen(false)}>
                    <Link href={`/search?type=manga&sort=score_desc`}>
                      Highest Rated
                    </Link>
                  </li>
                </ul>
              </li>

              <li role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <Link href={`/news`}>News</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {isMenuOpen && (
        <motion.div
          id={styles.menu_overlay}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      )}
    </div>
  );
}

export default MenuList;
