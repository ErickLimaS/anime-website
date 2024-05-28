import { initFirebase } from "@/app/firebaseApp"
import { User } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"

export async function getUserAdultContentPreference(user: User) {

    const db = getFirestore(initFirebase())

    const userAdultContentPreference: boolean = await getDoc(doc(db, 'users', user!.uid)).then(doc => doc.get("showAdultContent"))

    return userAdultContentPreference

}