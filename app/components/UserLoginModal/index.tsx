import { AnimatePresence, motion } from 'framer-motion'
import React, { MouseEventHandler, useState } from 'react'
import styles from "./component.module.css"
import GoogleSvg from '@/public/assets/google-fill.svg'
import GitHubSvg from '@/public/assets/github.svg'
import AnonymousSvg from '@/public/assets/person-fill.svg'
import CloseSvg from '@/public/assets/x.svg'
import LoadingSvg from '@/public/assets/Eclipse-1s-200px.svg'
import {
    signInWithPopup, GoogleAuthProvider,
    GithubAuthProvider, Auth, signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInAnonymously,
    User
} from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'
import ProfileFallbackImg from "@/public/profile_fallback.jpg"
import { useAuthState } from 'react-firebase-hooks/auth'
import UserSettingsModal from '@/app/layout/header/components/UserSettingsModal'

type ModalTypes = {
    onClick?: MouseEventHandler<HTMLDivElement>,
    auth: Auth
}

function UserModal({ onClick, auth, }: ModalTypes) {

    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider()

    const db = getFirestore(initFirebase())

    const [user] = useAuthState(auth)

    const [isLoading, setIsLoading] = useState(false)
    const [showSettingsMenu, setShowSettingsMenu] = useState(false)

    const [alternativeForm, setAlternativeForm] = useState(false)
    const [loginError, setLoginError] = useState<{ code: string, message: string } | null>(null)

    const dropIn = {

        hidden: {
            x: "-100vw",
            opacity: 0
        },
        visible: {
            x: "0",
            opacity: 1,
            transition: {
                duration: 0.2,
                damping: 25,
                type: "spring",
                stiffness: 500
            }
        },
        exit: {
            x: "100vw",
            opacity: 0
        }

    }

    async function newUserDoc(user: User) {

        const userHasDoc = await getDoc(doc(db, "users", user.uid)).then(res => res.data())
        
        if (userHasDoc) return

        // shows settings to new user
        setShowSettingsMenu(true)

        await setDoc(doc(collection(db, "users"), user.uid), {
            bookmarks: [],
            keepWatching: [],
            comments: {},
            episodesWatchedBySource: {},
            videoSource: "gogoanime",
            showAdultContent: false,
            autoNextEpisode: true,
            autoSkipIntroAndOutro: false,
            videoQuality: "auto",
            videoSubtitleLanguage: "English",
        })

    }

    const signInGoogle = async () => {
        await signInWithPopup(auth, googleProvider)
            .then(async (res) => await newUserDoc(res.user))
            .catch((err: any) => {

                setLoginError({
                    code: err.code,
                    message: err.message
                })

            })
    }

    const signInGithub = async () => {
        await signInWithPopup(auth, githubProvider)
            .then(async (res) => await newUserDoc(res.user))
            .catch((err: any) => {

                setLoginError({
                    code: err.code,
                    message: err.message
                })

            })
    }


    const signAnonymously = async () => {
        await signInAnonymously(auth)
    }

    async function handleLoginForm(e: React.FormEvent<HTMLFormElement>, action: "login" | "signup") {

        e.preventDefault()

        setIsLoading(true)

        const form: any = e.target

        // signup
        if (action == "signup") {
            try {

                const doesPasswordFieldsMatch = form.password.value.trim() == form.confirm_password.value.trim()

                if (!doesPasswordFieldsMatch) {
                    setLoginError({
                        code: "password",
                        message: "Passwords doesn't match."
                    })

                    setIsLoading(false)

                    return
                }

                const res = await createUserWithEmailAndPassword(auth, form.email.value.trim(), form.password.value.trim())

                // update user info
                await updateProfile(res.user, {
                    displayName: form.username.value,
                    photoURL: ProfileFallbackImg.src as string
                })

                // add default values to user doc
                await newUserDoc(res.user)

                setLoginError(null)
            }
            catch (err: any) {

                setLoginError({
                    code: err.code,
                    message: err.message
                })

            }
        }
        // login
        else {
            try {
                const res = await signInWithEmailAndPassword(auth, form.email.value.trim(), form.password.value.trim())
                setLoginError(null)
            }
            catch (err: any) {

                setLoginError({
                    code: err.code,
                    message: err.code == "auth/invalid-credential" ? "Check Your Email and Password, then try again." : err.message
                })

            }
        }

        setIsLoading(false)

    }

    // only opens when user has created a account
    if (user && showSettingsMenu) {
        return <UserSettingsModal auth={auth} onClick={onClick} newUser />
    }

    return !user && (
        <motion.div
            id={styles.backdrop}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            < motion.div
                onClick={(e) => e.stopPropagation()}
                id={styles.modal}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >

                <div id={styles.heading}>
                    <h5>Login with</h5>
                    <button
                        aria-label='Close User Panel'
                        onClick={onClick as unknown as MouseEventHandler<HTMLButtonElement>}
                    >
                        <CloseSvg width={16} height={16} alt={"Close icon"} />
                    </button>
                </div>

                <div id={styles.login_buttons_container}>

                    <div>
                        <button title='Google' id={styles.google_button} onClick={() => signInGoogle()}>
                            <GoogleSvg width={16} height={16} alt={"Google icon"} />
                        </button>
                        <small>Google</small>
                    </div>

                    <div>
                        <button title='Anonymously' id={styles.anonymous_button} onClick={() => signAnonymously()}>
                            <AnonymousSvg width={16} height={16} alt={"Anonymous icon"} />
                        </button>
                        <small>Anonymously</small>
                    </div>

                    <div>
                        <button title='GitHub' id={styles.github_button} onClick={() => signInGithub()}>
                            <GitHubSvg width={16} height={16} alt={"GitHub icon"} />
                        </button>
                        <small>GitHub</small>
                    </div>

                </div>

                <div id={styles.span_container}>
                    <span></span>
                    <span>or</span>
                    <span></span>
                </div>

                <motion.form
                    onSubmit={(e) => handleLoginForm(e, alternativeForm ? "signup" : "login")}
                    onChange={() => setLoginError(null)}
                    data-error-occurred={loginError ? true : false}
                >

                    <AnimatePresence>
                        {alternativeForm && (
                            <motion.label
                                initial={{ opacity: 0, height: 0, }}
                                animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                Username
                                <input
                                    type='text'
                                    name='username'
                                    pattern="^.{1,15}$"
                                    title={"The limit is 15 characters."}
                                    placeholder='Your Username'
                                    required>
                                </input>
                            </motion.label>
                        )}
                    </AnimatePresence>

                    <label>
                        Email
                        <input
                            type='email'
                            name='email'
                            placeholder='Your Email'
                            required></input>
                    </label>

                    <label>
                        Password
                        <input
                            type='password'
                            name='password'
                            pattern="^(?=.*\d)(?=.*[a-zA-Z]).{8,}$"
                            title={"Password has to have at least 1 letter and 1 number. Min. 8 characters."}
                            autoComplete={alternativeForm ? 'new-password' : 'current-password'}
                            placeholder='Your Password'
                            required>
                        </input>
                    </label>

                    <AnimatePresence>
                        {alternativeForm && (
                            <motion.label
                                initial={{ opacity: 0, height: 0, marginTop: "8px" }}
                                animate={{ opacity: 1, height: "auto", transition: { duration: 0.4 } }}
                                exit={{ opacity: 0, height: 0, marginTop: "0" }}
                            >
                                Confirm Password
                                <input
                                    type='password'
                                    name='confirm_password'
                                    pattern="^(?=.*\d)(?=.*[a-zA-Z]).{8,}$"
                                    title={"Password has to have at least 1 letter and 1 number. Min. 8 characters."}
                                    placeholder='Your Password Again'
                                    required>
                                </input>
                            </motion.label>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type='submit'
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                    >

                        <AnimatePresence>
                            {isLoading ? (
                                <LoadingSvg width={16} height={16} alt={"Loading"} />
                            ) : (
                                alternativeForm ? (
                                    <motion.span>
                                        SIGN UP
                                    </motion.span>
                                ) : (
                                    <motion.span>
                                        LOGIN
                                    </motion.span>
                                )
                            )}
                        </AnimatePresence>
                    </motion.button>

                </motion.form>

                <AnimatePresence>
                    {loginError && (
                        <motion.p
                            style={{ color: "var(--black-100)", padding: "16px", background: "var(--black-05)" }}
                            initial={{
                                opacity: 0,
                                height: 0
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto"
                            }}
                            exit={{
                                opacity: 0,
                                height: 0
                            }}
                        >
                            <span style={{ color: "var(--error)" }}>{loginError.code}:</span> {loginError.message}
                        </motion.p>
                    )}
                </AnimatePresence>

                <motion.button
                    id={styles.create_account_button}
                    onClick={() => setAlternativeForm(!alternativeForm)}
                >
                    {alternativeForm ? "Or Login in Your Account" : "Or Create Your Account"}
                </motion.button>

            </motion.div>
        </motion.div >

    )
}

export default UserModal