import Link from 'next/link'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import errorImg from "@/public/404.jpg"
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

    // h1
    const errorH1Styles = {
        fontWeight: "300",
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
                <h1 style={errorH1Styles}>Page Not Found!</h1>

                <Image src={errorImg} width={240} alt={'Error 404'} />

                <small style={{ fontSize: "10px" }}>
                    <a style={{ fontSize: "10px" }} href="https://www.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_13315300.htm#query=error%20404%20svg&position=0&from_view=keyword&track=ais&uuid=355f07d9-a7b2-462e-83b7-a05744e5d953">
                        Image by storyset
                    </a>
                    {" "}on Freepik
                </small>
            </div>

            <div style={errorButtonContainerStyles}>

                <Link href={"/"} style={errorReturnHomeContainerStyles}>
                    Return to Home Page
                </Link>

            </div>

        </div>

    )
}

export default Custom404