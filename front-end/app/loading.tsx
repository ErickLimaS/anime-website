import React from 'react'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"

function LoadingPlaceholder() {
    return (
        <div style={{ height: "80vh", width: "100%", margin: "auto", display: "flex" }}>
            <div style={{ margin: "auto", display: "flex", flexDirection: "column" }}>
                <LoadingSvg style={{ display: "block" }} width={120} height={120} alt="Loading Page Content" />
                <p style={{ margin: "auto", marginTop: "16px", fontSize: "var(--font-size--h5)", color: "var(--white-25)", fontWeight: 600 }}>Loading...</p>
            </div>
        </div>
    )
}

export default LoadingPlaceholder