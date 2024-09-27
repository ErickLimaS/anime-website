import { initFirebase } from "@/app/firebaseApp";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export async function getUserAdultContentPreference(userId: string) {
  const db = getFirestore(initFirebase());

  const userAdultContentPreference: boolean = await getDoc(
    doc(db, "users", userId)
  ).then((doc) => doc.get("showAdultContent"));

  return userAdultContentPreference;
}
