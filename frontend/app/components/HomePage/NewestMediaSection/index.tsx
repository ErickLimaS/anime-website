"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import * as MediaCard from "../../MediaCards/MediaCard";
import * as MediaCardClientSide from "../../MediaCards/MediaCard/variantClientSide";
import * as MediaInfoExpanded from "../../MediaCards/MediaInfoExpandedWithCover";
import NavigationButtons from "../../NavigationButtons";
import {
  AiringMediaResult,
  MediaData,
} from "@/app/ts/interfaces/anilistMediaData";
import anilist from "@/app/api/anilist/anilistMedias";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { getUserAdultContentPreference } from "@/app/lib/user/userDocFetchOptions";

export const revalidate = 1800; // revalidate the data every 30 min

function NewestMediaSection({
  initialAnimesList,
}: {
  initialAnimesList: MediaData[];
}) {
  const [animesList, setAnimesList] = useState<
    AiringMediaResult[] | MediaData[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currDaysValue] = useState<number>(1);

  const [isAdultContentSetToShow, setIsAdultContentSetToShow] = useState<
    boolean | null
  >(null);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!initialAnimesList[0]) {
      fetchMediaByDaysRange(30);

      return;
    }

    setAnimesList(initialAnimesList);
    setIsLoading(false);
  }, [currDaysValue]);

  async function getUserPreference() {
    if (!user) return false;

    if (isAdultContentSetToShow) return isAdultContentSetToShow;

    const userAdultContentPreference: boolean =
      await getUserAdultContentPreference(user.uid);

    setIsAdultContentSetToShow(userAdultContentPreference);

    return userAdultContentPreference;
  }

  const handleParameterToFetchNewData: (parameter: 1 | 7 | 30) => void = async (
    parameter: 1 | 7 | 30
  ) => {
    fetchMediaByDaysRange(parameter);
  };

  async function fetchMediaByDaysRange(days: 1 | 7 | 30) {
    setIsLoading(true);

    const isAdultContentAllowed = await getUserPreference();

    const listAnimesByDaysRange = await anilist
      .getReleasingByDaysRange({
        type: "ANIME",
        days: days,
        perPage: 11,
        showAdultContent: isAdultContentAllowed,
      })
      .then((res) =>
        (res as AiringMediaResult[])
          .sort((a, b) => a.media.popularity - b.media.popularity)
          .reverse()
      )
      .then((res) => res.map((item) => item.media));

    setAnimesList(listAnimesByDaysRange);

    setIsLoading(false);
  }

  return (
    <div id={styles.newest_conteiner}>
      <div className={styles.title_navbar_container}>
        <h3>Newest Animes Episodes</h3>

        <NavigationButtons
          propsFunction={
            handleParameterToFetchNewData as (
              parameter: string | number
            ) => void
          }
          currValue={
            initialAnimesList[0] == null || initialAnimesList[0] == undefined
              ? 30
              : currDaysValue
          }
          buttonOptions={[
            { name: "Today", value: 1 },
            { name: "This week", value: 7 },
            { name: "Last 30 days", value: 30 },
          ]}
        />
      </div>

      <ul>
        {!isLoading && (
          <React.Fragment>
            <li>
              {animesList[0] ? (
                <MediaInfoExpanded.Container
                  mediaInfo={animesList[0] as MediaData}
                >
                  <MediaInfoExpanded.Description
                    description={(animesList as MediaData[])[0].description}
                  />

                  <MediaInfoExpanded.Buttons
                    media={(animesList as MediaData[])[0]}
                    mediaId={(animesList as MediaData[])[0].id}
                    mediaFormat={(animesList as MediaData[])[0].format}
                  />
                </MediaInfoExpanded.Container>
              ) : (
                <p>No results for today</p>
              )}
            </li>

            {(animesList as MediaData[]).slice(1, 11).map((media, key) => (
              <MediaCardClientSide.ListItemContainer
                key={key}
                positionIndex={key + 1}
                showCoverArt={{ mediaInfo: media }}
                alternativeBorder
              >
                <MediaCard.MediaInfo mediaInfo={media} />
              </MediaCardClientSide.ListItemContainer>
            ))}
          </React.Fragment>
        )}
      </ul>
    </div>
  );
}

export default NewestMediaSection;
