"use client"
import Link from 'next/link'
import React, { DetailedHTMLProps, HTMLAttributes, useEffect } from 'react'
import ErrorImg from "@/public/error-img-4.png"
import Image from 'next/image'
import { motion } from 'framer-motion'

function ErrorPage({ error, reset }: {
    error: Error & { digest?: string }
    reset: () => void
}) {

    useEffect(() => {
        console.error(error)
    }, [error])

    const errorContainerStyles = {
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        gap: "16px 0",
        margin: "20px auto",
        height: "80vh",
        maxHeight: "700px",
        background: 'var(--white-100)',
        width: "96%",
        maxWidth: "720px",
        borderRadius: "8px",
        boxShadow: "5px 5px 1px 0px var(--black-25)"

    }

    // img container
    const imgStylesContainer = {

        display: "flex",
        alignItems: "center",
        margin: "auto",

    } as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

    // h1
    const errorH1Styles = {
        fontWeight: "700",
        color: "var(--error)",
        padding: "16px"
    }

    // p
    const errorPStyles = {
        fontWeight: "500",
        padding: "16px"
    }

    const errorHeadingContainerStyles = {

        display: "flex",
        flexDirection: "column",
        gap: "32px 0",
        margin: "0 auto auto auto",
        textAlign: "center",

    }

    const errorButtonContainerStyles = {

        display: "flex",
        gap: "0 16px",
        margin: "32px auto",
        maxWidth: "720px",

    }

    const errorRetryBtnContainerStyles = {

        padding: "16px 8px",
        border: "1px solid var(--brand-color)",
        borderRadius: "4px",
        background: "var(--white-100)",
        color: "var(--brand-color) ",
        fontWeight: "300"

    }

    const errorReturnHomeContainerStyles = {

        padding: "16px 8px",
        border: "1px solid var(--brand-color)",
        borderRadius: "4px",
        background: "var(--brand-color)",
        color: "var(--white-100)",
        fontWeight: "300"

    }

    return (

        <div style={errorContainerStyles as any}>

            <div style={imgStylesContainer}>
                <Image src={ErrorImg} height={240} alt={'Error 404'} />
            </div>

            <div style={errorHeadingContainerStyles as any}>
                <h1 style={errorH1Styles}>Something went wrong!</h1>

                <p style={errorPStyles}>{error.name}: {error.message}</p>

                <span style={{background: "var(--black-05)", padding: "8px", margin:"0 16px"}}>{error.stack}</span>
            </div>

            <div style={errorButtonContainerStyles}>
                <motion.button
                    onClick={() => reset()} style={errorRetryBtnContainerStyles as any}
                    whileTap={{ scale: 0.9 }}
                >
                    Try again
                </motion.button>

                <motion.a
                    href={"/"}
                    style={errorReturnHomeContainerStyles}
                    whileTap={{ scale: 0.9 }}
                >
                    Return to Home Page
                </motion.a>

            </div>

        </div>

    )
}

export default ErrorPage