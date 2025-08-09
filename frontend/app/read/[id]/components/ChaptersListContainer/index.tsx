"use client";
import React, { useEffect } from "react";
import styles from "./component.module.css";
import { MangadexMangaChapters } from "@/app/ts/interfaces/mangadex";
import Link from "next/link";
import { motion } from "framer-motion";
import MarkChapterAsReadButton from "@/app/components/Buttons/MarkChapterAsRead";

type ComponentTypes = {
  mediaId: number;
  currChapterId: string;
  chaptersList: MangadexMangaChapters[];
};

function ChaptersListContainer({
  mediaId,
  currChapterId,
  chaptersList,
}: ComponentTypes) {
  useEffect(() => {
    function centerActiveListItemEpisode() {
      const elementActive = document.querySelector("li[data-active=true]");

      elementActive?.scrollIntoView();

      window.scrollTo({ top: 0, behavior: "instant" });
    }

    setTimeout(centerActiveListItemEpisode, 2000);
  }, [currChapterId]);

  return (
    <div id={styles.chapters_list_container}>
      <div className={styles.heading_container}>
        <h3>CHAPTERS</h3>
      </div>

      <motion.ol id={styles.list_container}>
        {chaptersList?.map((chapter, key) => (
          <motion.li
            title={`Chapter ${chapter.chapterNumber} - ${chapter.title}`}
            key={key}
            data-active={chapter.id == currChapterId}
            data-disabled={chapter.pages == 0}
          >
            <Link
              href={`/read/${mediaId}?source=mangadex&chapter=${chapter.chapterNumber}&q=${chapter.id}`}
            >
              <div className={styles.img_container}>
                <span>{chapter.chapterNumber}</span>
              </div>
            </Link>

            <div className={styles.chapter_info_container}>
              <Link
                href={`/read/${mediaId}?source=mangadex&chapter=${chapter.chapterNumber}&q=${chapter.id}`}
              >
                <h4>
                  {chapter.pages == 0
                    ? `${chapter.title} (Not Available)`
                    : chapter.title == chapter.chapterNumber
                      ? `Chapter ${chapter.chapterNumber}`
                      : chapter.title}
                </h4>
              </Link>

              <MarkChapterAsReadButton
                chapterNumber={Number(chapter.chapterNumber)}
                chapterTitle={chapter.title}
                maxChaptersNumber={chaptersList.length}
                mediaId={mediaId}
                showAdditionalText={true}
              />
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}

export default ChaptersListContainer;
