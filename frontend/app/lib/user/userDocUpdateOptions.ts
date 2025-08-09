import { initFirebase } from "@/app/firebaseApp";
import {
  arrayRemove,
  arrayUnion,
  doc,
  FieldPath,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

type UpdateFavourites = {
  mediaData: {
    id: number;
    title: {
      romaji: string;
    };
    format: string;
    description: string;
    coverImage: {
      extraLarge: string;
      large: string;
    };
  };
  userId: string;
  isAddAction: boolean;
};

export async function updateUserFavouriteMedias({
  mediaData,
  userId,
  isAddAction,
}: UpdateFavourites) {
  const db = getFirestore(initFirebase());

  await updateDoc(
    doc(db, "users", userId),
    {
      bookmarks: isAddAction
        ? arrayUnion(...[mediaData])
        : arrayRemove(...[mediaData]),
    } as unknown as FieldPath,
    { merge: true }
  )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function updateUserMediaListByStatus({
  status,
  mediaData,
  userId,
}: {
  status: string;
  mediaData: UpdateFavourites["mediaData"];
  userId: string;
}) {
  const db = getFirestore(initFirebase());

  await updateDoc(doc(db, "users", userId), {
    [`mediaListSavedByStatus.${[status.toLowerCase()]}`]: arrayUnion(
      ...[mediaData]
    ),
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function removeMediaOnListByStatus({
  status,
  newListFiltered,
  userId,
}: {
  status: string;
  newListFiltered: UpdateFavourites["mediaData"];
  userId: string;
}) {
  const db = getFirestore(initFirebase());

  await updateDoc(doc(db, "users", userId), {
    [`mediaListSavedByStatus.${[status.toLowerCase()]}`]: newListFiltered,
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
