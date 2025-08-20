"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import * as MediaCard from "@/app/components/MediaCards/MediaCard";
import { MediaOnJSONFile } from "@/app/ts/interfaces/jsonMediaData";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectSort from "@/app/components/SelectSortInputs";
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg";

const framerMotionShowUp = {
  hidden: {
    opacity: 0,
    scale: 1.08,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.5,
    },
  },
};

function ResultsContainer({
  mediasList,
  totalLength,
  lastUpdate,
}: {
  mediasList: MediaOnJSONFile[];
  totalLength: number | undefined;
  lastUpdate: string;
}) {
  const [currPageNumber, setCurrPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resultsPerPage = 12;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(
    () =>
      setCurrPageNumber(
        Number(
          new URLSearchParams(Array.from(searchParams.entries())).get("page")
        ) || 1
      ),
    []
  );

  function fetchNextResultPage() {
    setIsLoading(true);

    const currSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    currSearchParams.set("page", `${currPageNumber + 1}`);
    setCurrPageNumber(currPageNumber + 1);

    const newSearchParams = currSearchParams ? `?${currSearchParams}` : "";

    router.push(`${pathname}${decodeURI(newSearchParams)}`, { scroll: false });

    setIsLoading(false);
  }

  return (
    <div id={styles.content_container}>
      <div id={styles.heading_container}>
        <h1>Results</h1>

        <SelectSort />
      </div>

      {mediasList.length == 0 && (
        <div id={styles.error_text}>
          <h2>No Results Found</h2>
        </div>
      )}

      {mediasList.length > 0 && (
        <div>
          <AnimatePresence initial={true} mode="wait">
            <motion.ul
              id={styles.results_container}
              variants={framerMotionShowUp}
              initial="hidden"
              animate="visible"
            >
              {mediasList.map((media, key) => (
                <motion.li key={key} variants={framerMotionShowUp}>
                  <MediaCard.Container onDarkMode>
                    <MediaCard.MediaImgLink
                      hideOptionsButton
                      mediaInfo={media}
                      title={media.title}
                      formatOrType={
                        media.type === "UNKNOWN" ? "SPECIAL" : media.type
                      }
                      url={media.picture}
                      mediaId={media.anilistId as string}
                    />

                    <MediaCard.SmallTag
                      seasonYear={media.animeSeason.year}
                      tags={media.tags[0]}
                    />

                    <MediaCard.LinkTitle
                      title={media.title}
                      anilistId={media.anilistId}
                    />
                  </MediaCard.Container>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      )}

      {/* totalLength == 0 is a exception, because backend returns that when data is cached */}
      {resultsPerPage * currPageNumber && (
        <button
          onClick={() => fetchNextResultPage()}
          aria-label={isLoading ? "Loading" : "View More Results"}
        >
          {isLoading ? <LoadingSvg width={16} height={16} /> : " + View more"}
        </button>
      )}

      {mediasList.length > 0 && (
        <span>
          Showing{" "}
          {resultsPerPage * currPageNumber >= (totalLength || 0)
            ? "all "
            : `${resultsPerPage * currPageNumber} out of `}
          <span>{(totalLength || 0).toLocaleString("en-US")}</span> results
        </span>
      )}

      <span style={{ display: "block", fontSize: "var(--font-size--small-2" }}>
        Last Update:{" "}
        {new Date(lastUpdate).toLocaleDateString("en-us", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) || "undefined"}
      </span>
    </div>
  );
}

export default ResultsContainer;
