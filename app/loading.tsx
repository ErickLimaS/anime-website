import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg"
import Image from 'next/image'
import Logo from "@/public/logo.png"

const imgContainerStyles = {
    position: "relative",
    aspectRatio: "1117 / 393",
    width: "80vw",
    maxWidth: "200px"
} as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function LoadingPlaceholder() {

    return (
        <div style={{ height: "80vh", width: "100%", margin: "auto", display: "flex" }}>
            <div style={{ margin: "auto", display: "flex", flexDirection: "column" }}>

                <div style={imgContainerStyles}>
                    <Image fill alt="Logo" src={Logo} />
                </div>

                <LoadingSvg width={64} height={82} alt="Loading" />

                <p style={{ margin: "auto", marginTop: "16px", fontSize: "var(--font-size--h5)", color: "var(--white-50)", fontWeight: 600 }}>
                    Loading...
                </p>

            </div>
        </div>
    )
}

export default LoadingPlaceholder