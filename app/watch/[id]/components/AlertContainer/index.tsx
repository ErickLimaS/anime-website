"use client"
import styles from "../../page.module.css"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

export function AlertWrongMediaVideoOnMediaId({ mediaTitle, mediaId, isActive }: { mediaTitle: string, mediaId: number, isActive: boolean }) {

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currSearchParams = new URLSearchParams(Array.from(searchParams.entries()))

    currSearchParams.set("alert", "false")

    return (
       
            <div id={styles.alert_container}>

                <h1>Alert!</h1>

                <h2>The current video {`doesn't`} match any video available for <span>{mediaTitle}</span></h2>

                <p>You <b>can still watch it</b>, but it can be a wrong anime/movie and may be saved on your <b>Keep Watching List</b> as other {`media's`} name.</p>

                <p>But {`don't`} worry! You can just remove it from Keep Watching later...</p>

                <div id={styles.redirect_btns_container}>

                    <Link href={`${pathname}${decodeURI(`?${currSearchParams}`)}`}>
                        Continue Anyway
                    </Link>

                    <Link href={`/media/${mediaId}`}>
                        Back to {mediaTitle.slice(0, 10)}... Page
                    </Link>

                </div>

            </div >
        )


}