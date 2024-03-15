import Link from 'next/link'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import ErrorImg from "@/public/error-img-1.png"
import Image from 'next/image'

function Custom404() {

    const errorContainerStyles = {
        display: "flex",
        flexDirection: "column",
        gap: "16px 0",
        margin: "20px auto",
        minHeight: "80vh",
        maxHeight: "700px",
        background: 'var(--white-100)',
        width: "96%",
        maxWidth: "720px",
        borderRadius: "8px",
        boxShadow: "5px 5px 1px 0px var(--black-25)"

    } as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

    // img container
    const imgStylesContainer = {

        display: "flex",
        alignItems: "center",
        margin: "auto",

    } as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

    // h1
    const errorH1Styles = {
        fontWeight: "700",
        color: "#f44336",
        padding: "16px"
    } as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

    const errorHeadingContainerStyles = {

        display: "flex",
        flexDirection: "column",
        gap: "32px 0",
        margin: "auto",
        textAlign: "center",
        alignItems: "center"

    } as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

    const errorButtonContainerStyles = {

        display: "flex",
        gap: "0 16px",
        margin: "32px auto",
        maxWidth: "720px",

    } as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

    const errorReturnHomeContainerStyles = {

        padding: "16px 8px",
        border: "1px solid var(--brand-color)",
        borderRadius: "4px",
        background: "var(--brand-color)",
        color: "var(--white-100)",
        fontWeight: "300"

    }

    return (

        <div style={errorContainerStyles}>

            <div style={errorHeadingContainerStyles}>

                <div style={imgStylesContainer}>
                    <Image src={ErrorImg} height={330} alt={'Error 404'} />
                </div>

                <h1 style={errorH1Styles}>Page Not Found!</h1>

                <small style={{ fontSize: "var(--font-size-p)" }}>
                    {`We can't find the page you're trying to reach`}
                </small>
            </div>

            <div style={errorButtonContainerStyles}>

                <a href={"/"} style={errorReturnHomeContainerStyles}>
                    Return to Home Page
                </a>

            </div>

        </div>

    )
}

export default Custom404