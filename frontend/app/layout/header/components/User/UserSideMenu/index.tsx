"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import PersonIcon from "@/public/assets/person-circle.svg";
import ChevronDownSvg from "@/public/assets/chevron-down.svg";
import ChevronUpSvg from "@/public/assets/chevron-up.svg";
import LogoutSvg from "@/public/assets/logout.svg";
import SettingsSvg from "@/public/assets/gear-fill.svg";
import StarListSvg from "@/public/assets/list-stars.svg";
import FavouriteSvg from "@/public/assets/heart.svg";
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import UserSettingsModal from "../UserSettingsModal";
import ShowUpLoginPanelAnimated from "@/app/components/UserLoginModal/animatedVariant";
import { useAppSelector, useAppDispatch } from "@/app/lib/redux/hooks";
import { removeUserInfo } from "@/app/lib/redux/features/manageUserData";
import {
  checkAccessTokenStillValid,
  removeCookies,
} from "@/app/lib/user/anilistUserLoginOptions";
import { useParams } from "next/navigation";
import { handleAnilistUserLoginWithRedux } from "@/app/lib/user/anilistUserLoginOptions";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";
import { usePathname } from "next/navigation";

const framerMotionShowUp = {
  hidden: {
    y: "-40px",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
  },
};

function UserSideMenu() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState<boolean>(false);

  const anilistUser = useAppSelector((state) => state.UserInfo?.value);
  const isLoginModalOpen = useAppSelector(
    (state) => state.ShowLoginModal?.value
  );
  const dispatch = useAppDispatch();

  const params = useParams();

  const pathname = usePathname();

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!user && !loading && !anilistUser) {
        handleAnilistUserLoginWithRedux();
      }
    }
  }, [user, loading, params]);

  useEffect(() => {
    if (typeof window !== "undefined" && anilistUser) {
      checkAccessTokenStillValid();
    }
  }, [anilistUser]);

  async function logUserOut() {
    if (anilistUser) {
      dispatch(removeUserInfo(undefined));

      return;
    }

    await removeCookies();

    auth.signOut();
  }

  function checkRoutesToOptionalCloseButton() {
    const notAllowedCloseButtonRoutes = ["/my-lists", "/favourites"];

    for (let i = 0; i < notAllowedCloseButtonRoutes.length; i++) {
      if (notAllowedCloseButtonRoutes[i] == pathname) return undefined;
    }

    return dispatch(toggleShowLoginModalValue());
  }

  return (
    <div id={styles.user_container}>
      <ShowUpLoginPanelAnimated
        apperanceCondition={isLoginModalOpen}
        customOnClickAction={() => checkRoutesToOptionalCloseButton()}
        auth={auth}
      />

      {!user && !anilistUser && (
        <React.Fragment>
          <button
            onClick={() => dispatch(toggleShowLoginModalValue())}
            aria-controls={styles.user_menu_list}
            aria-label={
              isUserMenuOpen
                ? "Click to Hide User Menu"
                : "Click to Show User Menu"
            }
            className={`display_flex_row align_items_center ${styles.heading_btn}`}
            id={styles.user_btn}
            data-useractive={false}
            data-loading={loading}
          >
            {loading && <LoadingSvg width={16} height={16} title="Loading" />}

            {!loading && (
              <React.Fragment>
                <PersonIcon
                  className={styles.scale}
                  alt="User Icon"
                  width={16}
                  height={16}
                />
                <span>Login</span>
              </React.Fragment>
            )}
          </button>
        </React.Fragment>
      )}

      {(user || anilistUser) && (
        <React.Fragment>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-controls={styles.user_menu_list}
            aria-label={
              isUserMenuOpen
                ? "Click to Hide User Menu"
                : "Click to Show User Menu"
            }
            className={`display_flex_row align_items_center ${styles.heading_btn} ${isUserMenuOpen ? `${styles.active}` : ""}`}
            id={styles.user_btn}
            data-useractive={true}
          >
            <span id={styles.img_container}>
              <Image
                src={
                  user
                    ? user.photoURL ||
                      "https://i.pinimg.com/736x/fc/4e/f7/fc4ef7ec7265a1ebb69b4b8d23982d9d.jpg"
                    : anilistUser?.avatar.medium ||
                      "https://i.pinimg.com/736x/fc/4e/f7/fc4ef7ec7265a1ebb69b4b8d23982d9d.jpg"
                }
                alt={user ? (user.displayName as string) : anilistUser!.name}
                fill
                sizes="32px"
              ></Image>
            </span>
            <span>
              {!isUserMenuOpen ? <ChevronDownSvg /> : <ChevronUpSvg />}
            </span>
          </button>

          <AnimatePresence initial={false} mode="wait">
            {isUserMenuOpen && (
              <motion.div
                variants={framerMotionShowUp}
                id={styles.user_menu_list}
                aria-expanded={isUserMenuOpen}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ul role="menu">
                  <li role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                    <Link href={"/favourites"}>
                      <FavouriteSvg
                        width={16}
                        height={16}
                        alt={"Favourites Icon"}
                      />{" "}
                      Favourites
                    </Link>
                  </li>
                  <li role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                    <Link href={"/my-lists"}>
                      <StarListSvg
                        width={16}
                        height={16}
                        alt={"History Icon"}
                      />{" "}
                      My Lists
                    </Link>
                  </li>
                  <li role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                    <button onClick={() => setIsUserSettingsOpen(true)}>
                      <SettingsSvg
                        width={16}
                        height={16}
                        alt={"Settings Icon"}
                      />{" "}
                      Settings
                    </button>
                  </li>
                  <li role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                    <button onClick={() => logUserOut()}>
                      <LogoutSvg width={16} height={16} alt={"Logout Icon"} />{" "}
                      Log Out
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}

            {isUserSettingsOpen && (
              <UserSettingsModal
                onClick={() => setIsUserSettingsOpen(!isUserSettingsOpen)}
                auth={auth}
                anilistUser={anilistUser}
                aria-expanded={isUserSettingsOpen}
              />
            )}
          </AnimatePresence>
        </React.Fragment>
      )}
    </div>
  );
}

export default UserSideMenu;
