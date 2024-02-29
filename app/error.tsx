"use client"
import Link from 'next/link'
import React, { useEffect } from 'react'

function ErrorPage({ error, reset }: {
    error: Error & { digest?: string }
    reset: () => void
}) {

    useEffect(() => {
        console.error(error)
    }, [error])

    const errorContainerStyles = {
        display: "flex",
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

    // h1
    const errorH1Styles = {
        fontWeight: "300",
        color: "#f44336",
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
        margin: "auto",
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

            <div style={errorHeadingContainerStyles as any}>
                <h1 style={errorH1Styles}>Something went wrong!</h1>

                <p style={errorPStyles}>{error.name}: {error.message}</p>
            </div>

            <div style={errorButtonContainerStyles}>
                <button onClick={() => reset()} style={errorRetryBtnContainerStyles as any}>
                    Try again
                </button>

                <Link href={"/"} style={errorReturnHomeContainerStyles}>
                    Return to Home Page
                </Link>

            </div>

        </div>

    )
}

export default ErrorPage