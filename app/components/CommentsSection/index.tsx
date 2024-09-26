"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import {
  getFirestore,
  doc,
  setDoc,
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  MediaData,
  MediaDataFullInfo,
} from "@/app/ts/interfaces/anilistMediaData";
import CommentContainer from "./components/CommentContainer";
import SvgLoading from "@/public/assets/ripple-1s-200px.svg";
import SvgFilter from "@/public/assets/filter-right.svg";
import WriteCommentFormContainer from "./components/WriteCommentForm";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { UserComment } from "@/app/ts/interfaces/firestoreData";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";

type CommentsSectionTypes = {
  mediaInfo: MediaDataFullInfo | MediaData;
  isOnWatchPage?: boolean;
  episodeId?: string;
  episodeNumber?: number;
};

export default function CommentsSection({
  mediaInfo,
  isOnWatchPage,
  episodeId,
  episodeNumber,
}: CommentsSectionTypes) {
  const [commentsList, setCommentsList] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [commentsSliceRange, setCommentsSliceRange] = useState<number>(3);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);
  const dispatch = useAppDispatch();

  const auth = getAuth();

  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    getCommentsForCurrMedia();
  }, [mediaInfo, user, anilistUser, episodeId]);

  function handleCommentsSliceRange() {
    setCommentsSliceRange(commentsSliceRange + 10);
  }

  async function handleCommentsSortBy(
    sortBy: "date" | "likes" | "dislikes",
    commentsUnsorted?: DocumentData[]
  ) {
    setIsLoading(true);

    if (!commentsUnsorted) commentsUnsorted = await getCommentsForCurrMedia();

    let sortedComments;

    switch (sortBy) {
      case "date":
        sortedComments = commentsUnsorted!.sort(
          (x, y) => y.createdAt - x.createdAt
        );
        setCommentsList(sortedComments);

        break;

      case "likes":
        sortedComments = commentsUnsorted!.sort((x, y) => y.likes - x.likes);
        setCommentsList(sortedComments);

        break;

      case "dislikes":
        sortedComments = commentsUnsorted!.sort(
          (x, y) => y.dislikes - x.dislikes
        );
        setCommentsList(sortedComments);

        break;

      default:
        sortedComments = commentsUnsorted!.sort(
          (x, y) => y.createdAt - x.createdAt
        );
        setCommentsList(sortedComments);

        break;
    }

    setIsLoading(false);
  }

  async function getCommentsForCurrMedia() {
    setIsLoading(true);

    let mediaComments = await getDocs(
      collection(
        db,
        "comments",
        `${mediaInfo.id}`,
        isOnWatchPage ? `${episodeId}` : "all"
      )
    );

    if (!mediaComments) {
      await setDoc(doc(db, "comments", `${mediaInfo.id}`), {});

      mediaComments = await getDocs(
        collection(
          db,
          "comments",
          `${mediaInfo.id}`,
          isOnWatchPage ? `${episodeId}` : "all"
        )
      );

      return;
    }

    if (isOnWatchPage) {
      const commentsForCurrEpisode: DocumentData[] = [];

      const queryCommentsToThisEpisode = query(
        collection(db, "comments", `${mediaInfo.id}`, "all"),
        where("episodeNumber", "==", episodeNumber)
      );

      const querySnapshot = await getDocs(queryCommentsToThisEpisode);

      querySnapshot.docs.forEach((doc) =>
        commentsForCurrEpisode.push(doc.data())
      );

      await handleCommentsSortBy("date", commentsForCurrEpisode);

      return;
    }

    const mediaCommentsMapped = mediaComments.docs.map(
      (doc: QueryDocumentSnapshot) => doc.data()
    );

    await handleCommentsSortBy("date", mediaCommentsMapped);

    setIsLoading(false);

    return mediaCommentsMapped;
  }

  return (
    <div id={styles.container}>
      <WriteCommentFormContainer
        isLoadingHook={isLoading}
        loadComments={getCommentsForCurrMedia}
        mediaInfo={mediaInfo}
        setIsLoadingHook={setIsLoading}
        setIsUserModalOpenHook={() => dispatch(toggleShowLoginModalValue())}
        episodeId={episodeId}
        episodeNumber={episodeNumber}
        isOnWatchPage={isOnWatchPage}
      />

      {/* ALL COMMENTS FROM DB FOR THIS MEDIA */}
      <div id={styles.all_comments_container}>
        {commentsList.length > 0 && (
          <React.Fragment>
            <div id={styles.comments_heading}>
              {commentsList.length > 1 && (
                <div id={styles.custom_select}>
                  <SvgFilter width={16} height={16} alt="Filter" />

                  <select
                    onChange={(e) =>
                      handleCommentsSortBy(
                        e.target.value as "date" | "likes" | "dislikes"
                      )
                    }
                    title="Choose How To Sort The Comments"
                  >
                    <option selected value="date">
                      Most Recent
                    </option>
                    <option value="likes">Most Likes</option>
                    <option value="dislikes">Most Dislikes</option>
                  </select>
                </div>
              )}

              <p>
                {commentsList.length} comment
                {commentsList.length > 1 ? "s" : ""}
              </p>
            </div>

            <ul>
              {!isLoading &&
                commentsList
                  .slice(0, commentsSliceRange)
                  .map((comment) => (
                    <CommentContainer
                      key={comment.createdAt}
                      comment={comment as UserComment}
                      mediaId={mediaInfo.id}
                      isLoadingHook={isLoading}
                      loadComments={getCommentsForCurrMedia}
                      mediaInfo={mediaInfo}
                      setIsLoadingHook={setIsLoading}
                      setIsUserModalOpenHook={() =>
                        dispatch(toggleShowLoginModalValue())
                      }
                      episodeId={episodeId}
                      episodeNumber={episodeNumber}
                      isOnWatchPage={isOnWatchPage}
                    />
                  ))}
            </ul>

            {commentsList.length > commentsSliceRange && (
              <button onClick={() => handleCommentsSliceRange()}>
                SEE MORE COMMENTS
              </button>
            )}
          </React.Fragment>
        )}

        {isLoading && (
          <div>
            <SvgLoading width={120} height={120} alt="Loading" />
          </div>
        )}

        {commentsList.length == 0 && !isLoading && (
          <div id={styles.no_comments_container}>
            <p>No Comments Yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
