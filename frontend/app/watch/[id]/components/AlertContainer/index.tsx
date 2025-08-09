"use client";
import axios from "axios";
import styles from "./component.module.css";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AlertWrongMediaVideoOnMediaId({
  mediaTitle,
  mediaId,
  mediaFormat,
}: {
  mediaTitle: string;
  mediaId: number;
  mediaFormat: string;
}) {
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [wrongMediaEnabled, setWrongMediaEnabled] = useState<boolean>(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  async function changePlayWrongMediaCookieValue() {
    await axios.post(
      `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/wrong-media-enabled`,
      {
        isEnabled: wrongMediaEnabled == true ? "false" : "true",
      }
    );

    setWrongMediaEnabled(!wrongMediaEnabled);
  }

  useEffect(() => {
    currSearchParams.delete("alert");
    setRedirectUrl(`${pathname}${decodeURI(`?${currSearchParams}`)}`);
  }, [currSearchParams]);

  return (
    <div id={styles.alert_container}>
      <div>
        <h1>Alert!</h1>

        <h2>
          The current video {`doesn't`} match any video available for{" "}
          <span>{mediaTitle}</span> (
          {mediaFormat == "TV" ? "ANIME" : mediaFormat})
        </h2>

        <div>
          <p>
            You <b>can still watch it</b>, but it can be a wrong anime/movie and
            may be saved on your <b>Keep Watching List</b> as other {`media's`}{" "}
            name.
          </p>

          <p>
            But {`don't`} worry! You can just remove it from Keep Watching
            later...
          </p>
        </div>

        <div>
          <label>
            {`Don't`} Show Again
            <input
              type="checkbox"
              onChange={() => changePlayWrongMediaCookieValue()}
            />
          </label>
        </div>

        <div id={styles.redirect_btns_container}>
          <a href={redirectUrl}>Continue Anyway</a>

          <Link href={`/media/${mediaId}`}>
            Back to {mediaTitle.slice(0, 10)}... Page
          </Link>
        </div>
      </div>
    </div>
  );
}
