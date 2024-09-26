import Image from "next/image";
import ErrorImg from "@/public/error-img-4.png";
import Link from "next/link";
import styles from "./component.module.css";
import { SourceType } from "@/app/ts/interfaces/episodesSource";

export function FetchEpisodeError({
  mediaId,
  searchParams,
}: {
  mediaId: number;
  searchParams: { source: SourceType["source"] | "mangadex"; dub?: string };
}) {
  return (
    <div id={styles.error_modal_container}>
      <div id={styles.heading_text_container}>
        <div>
          <Image src={ErrorImg} height={330} alt={"Error"} />
        </div>

        <h1>ERROR!</h1>

        <p>What could have happened: </p>

        <ul>
          {searchParams?.dub == "true" && (
            <li>
              <b>This anime/movie has no Dubbed Media available.</b>
            </li>
          )}
          <li>
            The Media ID <b>{mediaId}</b> might be wrong.
          </li>
          <li>
            <b>{searchParams.source}</b> {`doesn't have this media available.`}
          </li>
          <li>{`The Media ID doesn't match episode ID on ${searchParams.source}.`}</li>
          <li>Problems With Server.</li>
          <li>
            <b>{searchParams.source} API</b> had recent changes and/or not
            available.
          </li>
        </ul>
      </div>

      <div id={styles.redirect_btns_container}>
        <Link href={`/media/${mediaId}`}>Return To Media Page</Link>

        <Link href={"/"}>Return to Home Page</Link>
      </div>
    </div>
  );
}
