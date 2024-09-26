"use client";
import React, { useEffect, useId, useState } from "react";
import Image from "next/image";
import styles from "./component.module.css";
import { convertFromUnix } from "@/app/lib/formatDateUnix";
import SvgThumbUp from "@/public/assets/hand-thumbs-up.svg";
import SvgThumbUpFill from "@/public/assets/hand-thumbs-up-fill.svg";
import SvgThumbDown from "@/public/assets/hand-thumbs-down.svg";
import SvgThumbDownFill from "@/public/assets/hand-thumbs-down-fill.svg";
import SvgReply from "@/public/assets/reply.svg";
import SvgReplyFill from "@/public/assets/reply-fill.svg";
import SvgTrash from "@/public/assets/trash.svg";
import {
  DocumentData,
  FieldPath,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import WriteCommentFormContainer from "../WriteCommentForm";
import {
  MediaData,
  MediaDataFullInfo,
} from "@/app/ts/interfaces/anilistMediaData";
import { AnimatePresence, motion } from "framer-motion";
import ProfileFallbackImg from "@/public/profile_fallback.jpg";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { ReplyComment, UserComment } from "@/app/ts/interfaces/firestoreData";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";

type CommentComponentTypes = {
  comment: UserComment | ReplyComment;
  mediaId: number;
  isLoadingHook: boolean;
  setIsLoadingHook: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserModalOpenHook: () => void;
  loadComments: () => Promise<DocumentData[] | undefined>;
  mediaInfo: MediaDataFullInfo | MediaData;
  isOnWatchPage?: boolean;
  episodeId?: string;
  episodeNumber?: number;
};

export default function Comment({
  comment,
  mediaId,
  isLoadingHook,
  setIsLoadingHook,
  setIsUserModalOpenHook,
  loadComments,
  mediaInfo,
  isOnWatchPage,
  episodeId,
  episodeNumber,
}: CommentComponentTypes) {
  const uniqueReplyId = useId();

  const [isAReply, setIsAReply] = useState<boolean>(false);

  const [isLiked, setWasLiked] = useState<boolean>(false);
  const [wasDisliked, setWasDisliked] = useState<boolean>(false);
  const [isGettingAReply, setIsGettingAReply] = useState<boolean>(false);
  const [wasDeleted, setWasDeleted] = useState<boolean>(false);

  const [isSpoiler, setIsSpoiler] = useState<boolean>(comment.isSpoiler);

  const [commentData, setCommentData] = useState<UserComment>();
  const [commentDocId, setCommentDocId] = useState<string | DocumentData>();

  const anilistUser = useAppSelector((state) => state.UserInfo.value);
  const dispatch = useAppDispatch();

  const auth = getAuth();
  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    getCommentCurrLikesAndDislikes();
  }, [user, anilistUser, comment, mediaId]);
  useEffect(() => {
    getCommentCurrLikesAndDislikes();
  }, [commentData == null]);

  async function getCommentDoc() {
    let queryComment = query(
      collection(db, "comments", `${mediaId}`, "all"),
      where("createdAt", "==", comment.createdAt)
    );

    let commentDoc = await getDocs(queryComment);

    // Intended for Reply Comments
    if (!commentDoc.docs[0]) {
      queryComment = query(
        collection(db, "comments", `${mediaId}`, "replies"),
        where("createdAt", "==", comment.createdAt)
      );

      commentDoc = await getDocs(queryComment);

      setIsAReply(true);
    }

    if (!commentDoc.docs[0]) return;

    const commentDocId = commentDoc.docs[0].id;
    const commentDocData = commentDoc.docs[0].data();

    return {
      commentDocId: commentDocId,
      commentDocData: commentDocData as UserComment | DocumentData,
    };
  }

  async function handleLikesAndDislikesActions(
    buttonActionType: "like" | "dislike" | "reply",
    isActionSetToTrue: boolean
  ) {
    if (!user && !anilistUser) return dispatch(toggleShowLoginModalValue());

    if (user?.isAnonymous) return;

    const queryComment = await getCommentDoc();

    const commentDocData = queryComment!.commentDocData;
    const commentDocId = queryComment!.commentDocId;

    switch (buttonActionType) {
      case "like":
        if (isAReply) {
          await updateDoc(
            doc(db, "comments", `${mediaId}`, "replies", commentDocId),
            {
              likes: isActionSetToTrue
                ? commentDocData.likes + 1
                : commentDocData.likes == 0
                  ? 0
                  : commentDocData.likes - 1,
              dislikes: wasDisliked
                ? commentDocData.dislikes - 1
                : commentDocData.dislikes,
            }
          );
        } else {
          await updateDoc(
            doc(db, "comments", `${mediaId}`, "all", commentDocId),
            {
              likes: isActionSetToTrue
                ? commentDocData.likes + 1
                : commentDocData.likes == 0
                  ? 0
                  : commentDocData.likes - 1,
              dislikes: wasDisliked
                ? commentDocData.dislikes - 1
                : commentDocData.dislikes,
            }
          );
        }

        const commentLikedData = {
          commentRef: commentDocId,
          wasLiked: true,
          wasDisliked: false,
          wasReply: false,
        };

        await setDoc(
          doc(db, "users", user?.uid || `${anilistUser?.id}`),
          {
            comments: {
              interacted: isActionSetToTrue
                ? arrayUnion(...[commentLikedData])
                : arrayRemove(...[commentLikedData]),
            },
          } as unknown as FieldPath,
          { merge: true }
        );

        const queryUpdatedComment = await getCommentDoc();

        setCommentData(queryUpdatedComment!.commentDocData as UserComment);

        setWasLiked(isActionSetToTrue);
        if (wasDisliked) setWasDisliked(isActionSetToTrue ? false : true);

        return;

      case "dislike":
        if (isAReply) {
          await updateDoc(
            doc(db, "comments", `${mediaId}`, "replies", commentDocId),
            {
              likes: isLiked ? commentDocData.likes - 1 : commentDocData.likes,
              dislikes: isActionSetToTrue
                ? commentDocData.dislikes + 1
                : commentDocData.dislikes == 0
                  ? 0
                  : commentDocData.dislikes - 1,
            }
          );
        } else {
          await updateDoc(
            doc(db, "comments", `${mediaId}`, "all", commentDocId),
            {
              likes: isLiked ? commentDocData.likes - 1 : commentDocData.likes,
              dislikes: isActionSetToTrue
                ? commentDocData.dislikes + 1
                : commentDocData.dislikes == 0
                  ? 0
                  : commentDocData.dislikes - 1,
            }
          );
        }

        const commentDislikedData = {
          commentRef: commentDocId,
          wasLiked: false,
          wasDisliked: true,
          wasReply: false,
        };

        await setDoc(
          doc(db, "users", user?.uid || `${anilistUser?.id}`),
          {
            comments: {
              interacted: isActionSetToTrue
                ? arrayUnion(...[commentDislikedData])
                : arrayRemove(...[commentDislikedData]),
            },
          } as unknown as FieldPath,
          { merge: true }
        );

        const queryDislikesUpdate = await getCommentDoc();

        setCommentData(queryDislikesUpdate?.commentDocData as UserComment);

        setWasDisliked(isActionSetToTrue);
        if (isLiked) setWasLiked(isActionSetToTrue ? false : true);

        return;

      case "reply":
        return;

      default:
        return;
    }
  }

  async function deleteCurrComment() {
    // Only deletes from Curr Media Collection
    // Doesnt delete from User Doc comment history, so we can keep control

    await deleteDoc(
      doc(db, "comments", `${mediaId}`, "all", `${commentDocId}`)
    ).then(() => {
      setWasDeleted(true);
    });
  }

  async function getCommentCurrLikesAndDislikes() {
    const docQuery = await getCommentDoc();

    setCommentDocId(docQuery?.commentDocId);

    setCommentData(docQuery?.commentDocData as UserComment);

    if (!user && !anilistUser) return; // bellow is just to check curr user interactions with this comment

    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const userInteractionWithCurrComment = userDoc
      .get("comments.interacted")
      ?.find(
        (item: { commentRef: string }) =>
          item.commentRef == docQuery?.commentDocId
      );

    if (!userInteractionWithCurrComment) return;

    if (userInteractionWithCurrComment.wasLiked) setWasLiked(true);
    if (userInteractionWithCurrComment.wasDisliked) setWasDisliked(true);
  }

  return (
    !wasDeleted && (
      <li className={styles.comment_container} data-has-spoiler={isSpoiler}>
        <div className={styles.user_img_container}>
          <Image
            src={comment.userPhoto || ProfileFallbackImg}
            alt={comment.username || "User with no name"}
            fill
            sizes="72px"
          />
        </div>

        <div className={styles.comment_data}>
          <div className={styles.heading_container}>
            <h5>
              {comment.username!.length > 25
                ? `${comment.username!.slice(0, 25)}...`
                : comment.username}
            </h5>

            <p>
              {convertFromUnix(comment.createdAt, {
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div
            className={styles.comment_text_container}
            onClick={() => comment.isSpoiler && setIsSpoiler(!isSpoiler)}
          >
            <p>{comment.comment}</p>
          </div>

          {commentData && (
            <div
              className={`${styles.flex} display_flex_row space_beetween align_items_center`}
            >
              <div className={styles.buttons_container}>
                <button
                  onClick={() =>
                    handleLikesAndDislikesActions(
                      "like",
                      isLiked ? false : true
                    )
                  }
                >
                  <SvgIcons
                    type={"like"}
                    isBtnActive={isLiked}
                    commentData={commentData}
                  />
                </button>

                <button
                  onClick={() =>
                    handleLikesAndDislikesActions(
                      "dislike",
                      wasDisliked ? false : true
                    )
                  }
                >
                  <SvgIcons
                    type={"dislike"}
                    isBtnActive={wasDisliked}
                    commentData={commentData}
                  />
                </button>

                <button
                  onClick={() => setIsGettingAReply(!isGettingAReply)}
                  aria-controls={uniqueReplyId}
                >
                  <SvgIcons
                    type={"reply"}
                    isBtnActive={isGettingAReply}
                    commentData={commentData}
                  />
                </button>

                {(user?.uid || `${anilistUser?.id}`) == comment.userId.id && (
                  <button
                    className={styles.delete_btn}
                    onClick={() => deleteCurrComment()}
                  >
                    <SvgTrash width={16} height={16} alt="Delete Icon" />
                    Delete
                  </button>
                )}
              </div>

              {commentData.episodeNumber && (
                <small>On Episode {commentData.episodeNumber}</small>
              )}
            </div>
          )}

          <AnimatePresence>
            {isGettingAReply && (
              <motion.div
                id={uniqueReplyId}
                className={styles.reply_form_container}
                aria-expanded={isGettingAReply}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <WriteCommentFormContainer
                  isAReply
                  commentToBeRepliedDocId={commentDocId}
                  isLoadingHook={isLoadingHook}
                  loadComments={loadComments}
                  mediaInfo={mediaInfo}
                  setIsLoadingHook={setIsLoadingHook}
                  setIsUserModalOpenHook={() =>
                    dispatch(toggleShowLoginModalValue())
                  }
                  episodeId={episodeId}
                  episodeNumber={episodeNumber}
                  isOnWatchPage={isOnWatchPage}
                />

                <CommentsReplies
                  commentReplies={comment.replies}
                  parentHooks={{
                    comment: comment,
                    mediaId: mediaId,
                    isLoadingHook: isLoadingHook,
                    loadComments: loadComments,
                    mediaInfo: mediaInfo,
                    setIsLoadingHook: setIsLoadingHook,
                    setIsUserModalOpenHook: () => setIsUserModalOpenHook(),
                    episodeId: episodeId,
                    episodeNumber: episodeNumber,
                    isOnWatchPage: isOnWatchPage,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </li>
    )
  );
}

function SvgIcons({
  type,
  isBtnActive,
  commentData,
}: {
  type: "like" | "dislike" | "reply";
  isBtnActive: boolean;
  commentData: UserComment;
}) {
  switch (type) {
    case "like":
      if (isBtnActive) {
        return (
          <>
            <SvgThumbUpFill width={16} height={16} alt="Thumbs Up" />{" "}
            {commentData.likes != 0 && commentData.likes} &#x2022; Likes
          </>
        );
      }

      return (
        <>
          <SvgThumbUp width={16} height={16} alt="Thumbs Up" />{" "}
          {commentData.likes != 0 && commentData.likes} &#x2022; Like
        </>
      );

    case "dislike":
      if (isBtnActive) {
        return (
          <>
            <SvgThumbDownFill width={16} height={16} alt="Thumbs Down" />{" "}
            {commentData.dislikes != 0 && commentData.dislikes} &#x2022;
            Dislikes
          </>
        );
      }

      return (
        <>
          <SvgThumbDown width={16} height={16} alt="Thumbs Down" />{" "}
          {commentData.dislikes != 0 && commentData.dislikes} &#x2022; Dislike
        </>
      );

    case "reply":
      if (isBtnActive) {
        return (
          <>
            <SvgReplyFill width={16} height={16} alt="Reply" />{" "}
            {commentData.replies?.length != 0 && commentData.replies?.length}{" "}
            &#x2022; Reply
          </>
        );
      }

      return (
        <>
          <SvgReply width={16} height={16} alt="Reply" />{" "}
          {commentData.replies?.length != 0 && commentData.replies?.length}{" "}
          &#x2022; Reply
        </>
      );

    default:
      return;
  }
}

function CommentsReplies({
  commentReplies,
  parentHooks,
}: {
  commentReplies: ReplyComment[];
  parentHooks: CommentComponentTypes;
}) {
  return (
    commentReplies?.length > 0 &&
    commentReplies.map((commentMade) => (
      <Comment
        key={commentMade.createdAt}
        comment={commentMade}
        mediaId={parentHooks.mediaId}
        isLoadingHook={parentHooks.isLoadingHook}
        loadComments={parentHooks.loadComments}
        mediaInfo={parentHooks.mediaInfo}
        setIsLoadingHook={parentHooks.setIsLoadingHook}
        setIsUserModalOpenHook={() => parentHooks.setIsUserModalOpenHook()}
        episodeId={parentHooks.episodeId}
        episodeNumber={parentHooks.episodeNumber}
        isOnWatchPage={parentHooks.isOnWatchPage}
      />
    ))
  );
}
