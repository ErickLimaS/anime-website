import { motion } from 'framer-motion'
import React, { MouseEventHandler } from 'react'
import styles from "./component.module.css"
import GoogleSvg from '@/public/assets/google-fill.svg'
import CloseSvg from '@/public/assets/x.svg'
import { signInWithPopup, GoogleAuthProvider, Auth } from 'firebase/auth'

function UserModal({ onClick, auth, provider }: { onClick: MouseEventHandler<HTMLDivElement>, auth: Auth, provider: GoogleAuthProvider }) {

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

    const signIn = async () => {
        await signInWithPopup(auth, provider)
    }

    const handleLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

    }

    return (
        <motion.div
            id={styles.backdrop}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >

            <motion.div
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

                <button id={styles.google_button} onClick={() => signIn()}>
                    <GoogleSvg width={16} height={16} alt={"Login icon"} /> Login With Google
                </button>

                <div id={styles.span_container}>
                    <span></span>
                    <span>or</span>
                    <span></span>
                </div>

                <form onSubmit={(e) => handleLoginForm(e)}>

                    <label>
                        Email
                        <input type='email' placeholder='under development' required></input>
                    </label>

                    <label>
                        Password
                        <input type='password' placeholder='under development' required></input>
                    </label>

                    <button type='submit'>LOGIN</button>

                </form>

                <button
                    id={styles.create_account_button}
                    onClick={() => console.log("change state to sign up model")}
                >
                    Or Create Your Account
                </button>

            </motion.div>
        </motion.div>
    )

}

export default UserModal