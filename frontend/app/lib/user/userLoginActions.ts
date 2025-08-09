import { initFirebase } from "@/app/firebaseApp";
import { updateProfile, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { updateUserFavouriteMedias } from "./userDocUpdateOptions";
import { addUserCookies } from "./anilistUserLoginOptions";

type CreateUserComponentTypes = {
  userFirebase?: User;
  userAnilist?: UserAnilist;
  openMenuFunctionHook?: React.Dispatch<React.SetStateAction<boolean>>;
};

export async function createNewUserDocument({
  userFirebase,
  userAnilist,
  openMenuFunctionHook,
}: CreateUserComponentTypes) {
  if (!userFirebase && !userAnilist) return null;

  const db = getFirestore(initFirebase());

  const userId = userFirebase?.uid || `${userAnilist?.id}`;

  if (!userId) return;

  const doesUserHasDoc = await getDoc(doc(db, "users", userId)).then((res) =>
    res.data()
  );

  if (doesUserHasDoc) {
    const userData = {
      ...userAnilist,
      isUserFromAnilist: true,
    } as UserAnilist;

    if (userAnilist) {
      updatesUserDocWithAnilistFavourites({
        favourites: userAnilist.favourites,
        userId: `${userAnilist.id}`,
      });

      localStorage.setItem("anilist-user", JSON.stringify(userData));
    }

    addUserCookies({
      isAdultContentEnabled:
        `${userAnilist?.options.displayAdultContent}` || `${false}`,
      subtitleLanguage: doesUserHasDoc.videoSubtitleLanguage || "English",
      titleLanguage: userAnilist?.options.titleLanguage || "romaji",
      playWrongMedia: doesUserHasDoc.playVideoWhenMediaAndVideoIdMismatch
        ? `${doesUserHasDoc.playVideoWhenMediaAndVideoIdMismatch}`
        : "false",
    });

    return userData;
  }

  // if user is anonymous, set a placeholder Name and Photo
  if (userFirebase?.isAnonymous) {
    await updateProfile(userFirebase, {
      displayName: "Anonymous",
      photoURL:
        "https://i.pinimg.com/736x/fc/4e/f7/fc4ef7ec7265a1ebb69b4b8d23982d9d.jpg",
    });
  }

  if (openMenuFunctionHook) openMenuFunctionHook(true); // requires user to custom his new profile on Settings Panel

  const defaultNewUserDocValues = {
    bookmarks: [],
    keepWatching: [],
    mediaListSavedByStatus: [],
    notifications: [],
    comments: {},
    episodesWatched: {},
    chaptersRead: {},
    videoSource: "gogoanime",
    mediaTitlePreferredLang: "romaji",
    showAdultContent: userAnilist
      ? userAnilist.options.displayAdultContent
      : false,
    autoNextEpisode: true,
    autoSkipIntroAndOutro: false,
    playVideoWhenMediaAndVideoIdMismatch: false,
    videoQuality: "auto",
    videoSubtitleLanguage: "English",
  };

  await setDoc(
    doc(collection(db, "users"), userId),
    userFirebase
      ? defaultNewUserDocValues
      : {
        ...defaultNewUserDocValues,
        isUserFromAnilist: true,
        displayName: userAnilist!.name,
        photoURL:
            userAnilist!.avatar?.large ||
            userAnilist!.avatar?.medium ||
            "https://i.pinimg.com/736x/fc/4e/f7/fc4ef7ec7265a1ebb69b4b8d23982d9d.jpg",
      }
  );

  if (userAnilist) {
    updatesUserDocWithAnilistFavourites({
      favourites: userAnilist.favourites,
      userId: `${userAnilist.id}`,
    });

    localStorage.setItem("anilist-user", JSON.stringify(userAnilist));

    addUserCookies({
      isAdultContentEnabled:
        `${userAnilist?.options.displayAdultContent}` || `${false}`,
      subtitleLanguage: "English",
      titleLanguage: userAnilist?.options.titleLanguage || "romaji",
      playWrongMedia: "false",
    });

    return userAnilist;
  }
}

function updatesUserDocWithAnilistFavourites({
  favourites,
  userId,
}: {
  favourites: UserAnilist["favourites"];
  userId: string;
}) {
  const userFavouritesAnimesList = favourites.anime.nodes;
  const userFavouritesMangasList = favourites.manga.nodes;

  const allAnilistFavouritesOnSameList = [
    ...userFavouritesAnimesList,
    ...userFavouritesMangasList,
  ];

  if (
    userFavouritesAnimesList.length > 0 ||
    userFavouritesMangasList.length > 0
  ) {
    allAnilistFavouritesOnSameList.map(async (favouriteMedia) => {
      await updateUserFavouriteMedias({
        isAddAction: true,
        userId: userId,
        mediaData: favouriteMedia,
      });
    });
  }
}
