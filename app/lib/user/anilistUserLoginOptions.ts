import anilistUsers from "@/app/api/anilist/anilistUsers";
import axios from "axios";
import {
  addUserInfo,
  removeUserInfo,
} from "@/app/lib/redux/features/manageUserData";
import { makeStore } from "../redux/store";
import userSettingsActions from "@/app/api/cookie/userCookieSettingsActions";

export const userCustomStore = makeStore();

export async function handleAnilistUserLoginWithRedux() {
  const anilistUrlAccessInfo = window.location.hash;

  const accessToken = anilistUrlAccessInfo
    .slice(
      anilistUrlAccessInfo.search(/\baccess_token=\b/),
      anilistUrlAccessInfo.search(/\b&token_type\b/)
    )
    .slice(13);
  const tokenType = anilistUrlAccessInfo
    .slice(
      anilistUrlAccessInfo.search(/\btoken_type=\b/),
      anilistUrlAccessInfo.search(/\b&expires_in\b/)
    )
    .slice(11);
  const expiresIn = anilistUrlAccessInfo
    .slice(anilistUrlAccessInfo.search(/\bexpires_in=\b/))
    .slice(11);

  if (anilistUrlAccessInfo) {
    axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`, {
      accessToken: accessToken,
      tokenType: tokenType,
      expiresIn: expiresIn,
    });
  }

  const userData = await anilistUsers.getCurrUserData({
    accessToken: accessToken,
  });

  if (userData) {
    localStorage.setItem("anilist-user", JSON.stringify(userData));

    userCustomStore.dispatch(addUserInfo(userData));
  }
}

export async function checkAccessTokenStillValid() {
  try {
    await axios.get(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`
    );

    return;
  } catch {
    userCustomStore.dispatch(removeUserInfo());
  }
}

export async function addUserCookies({
  isAdultContentEnabled,
  titleLanguage,
  subtitleLanguage,
  playWrongMedia,
}: {
  isAdultContentEnabled: string;
  titleLanguage: string;
  subtitleLanguage: string;
  playWrongMedia: string;
}) {
  try {
    await userSettingsActions.setMediaTitleLanguageCookie({
      lang: titleLanguage,
    });

    await userSettingsActions.setAdultContentCookie({
      isEnabled: isAdultContentEnabled,
    });

    await userSettingsActions.setSubtitleLanguageCookie({
      lang: subtitleLanguage,
    });

    await userSettingsActions.setPlayWrongMediaCookie({
      playWrongMedia: playWrongMedia,
    });
  } catch (err) {
    console.log(err);

    return err;
  }
}

export async function removeCookies() {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/adult-content`
    );
    await axios.delete(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/media-title-language`
    );
    await axios.delete(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/subtitle`
    );
    await axios.delete(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/wrong-media-enabled`
    );
    await axios.delete(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`
    );
  } catch (err) {
    console.log(err);

    return err;
  }
}
