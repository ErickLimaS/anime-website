import React from "react";
import styles from "./headerComponent.module.css";
import Image from "next/image";
import ChevronDownIcon from "@/public/assets/chevron-down.svg";
import Link from "next/link";
import AnimeNavListHover from "./components/AnimeNavListHover";
import MangaNavListHover from "./components/MangaNavListHover";
import UserSideMenu from "./components/User/UserSideMenu";
import MenuList from "./components/MenuList";
import SearchFormContainer from "./components/SearchFormContainer";
import NewsNavListHover from "./components/NewsNavListHover";
import NotificationsContainer from "./components/Notifications";

function Header() {
  return (
    <header id={styles.background}>
      <div id={styles.container} className="display_flex_row padding_16px">
        <div
          id={styles.menu_and_logo_container}
          className="display_flex_row align_items_center"
        >
          {/* MENU NAVIGATION -- SCREEN LEFT SIDE -- MOBILE*/}
          <MenuList />

          <Link href="/" id={styles.img_container}>
            <Image
              id={styles.logo}
              src={"/logo.png"}
              alt="AniProject Website Logo"
              fill
              sizes="110px"
            />
          </Link>
        </div>

        <div id={styles.navbar_container} className={`align_items_center`}>
          <ul className="display_grid">
            <li className="display_flex_row align_items_center">
              Animes{" "}
              <ChevronDownIcon alt="Open Animes List" width={16} height={16} />
              <AnimeNavListHover />
            </li>

            <li className="display_flex_row align_items_center">
              Mangas{" "}
              <ChevronDownIcon alt="Open Mangas List" width={16} height={16} />
              <MangaNavListHover />
            </li>
            <li className="display_flex_row align_items_center">
              <Link href={"/news"}>
                News{" "}
                <ChevronDownIcon alt="Open News List" width={16} height={16} />
              </Link>

              <NewsNavListHover />
            </li>
          </ul>
        </div>

        <div
          id={styles.user_and_search_container}
          className="display_flex_row align_items_center"
        >
          <SearchFormContainer />

          <NotificationsContainer />

          <UserSideMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
