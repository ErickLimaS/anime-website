"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import CloudOfflineSvg from "@/public/assets/cloud-offline.svg";
import CloudOnlineSvg from "@/public/assets/cloud.svg";
import { SourceType } from "@/app/ts/interfaces/episodesSource";
import { getAniwatchEpisodeByEpisodeId } from "@/app/api/episodes/aniwatch/episodesInfo";
import { consumetEpisodeByEpisodeId } from "@/app/api/episodes/consumet/episodesInfo";

type PropsType = {
  propsFunction: (parameter: string | number) => void;
  buttonOptions: {
    isAvailable: boolean;
    name: string;
    value: SourceType["source"];
  }[];
  currValue?: string | number;
  sepateBtnsWithSpan?: boolean;
  showSourceStatus?: boolean;
};

export default function NavigationButtons({
  propsFunction,
  buttonOptions,
  currValue,
  sepateBtnsWithSpan,
  showSourceStatus,
}: PropsType) {
  const [lastValueReturned, setLastValueReturned] = useState<string | number>();

  const [sourcesAvailabilty, setSourcesAvailabilty] = useState<
    {
      name: string;
      value: SourceType["source"];
      isAvailable: boolean;
    }[]
  >([]);

  useEffect(() => setLastValueReturned(currValue || "" || 1), [currValue]);

  useEffect(() => {
    if (buttonOptions) checkVideoSourceAvailability(buttonOptions);
  }, [buttonOptions]);

  function handlePropsFunctionWithBtnValue(btnActionValue: string | number) {
    if (lastValueReturned == btnActionValue) return;

    // run the received function
    propsFunction(btnActionValue);

    // set the actual value
    setLastValueReturned(btnActionValue);
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async function checkVideoSourceAvailability(
    videoSourcesAvailable: PropsType["buttonOptions"]
  ) {
    videoSourcesAvailable.map(async (source) => {
      switch (source.value) {
        case "gogoanime":
          const gogoanimeResponse = await consumetEpisodeByEpisodeId({
            episodeId: "one-piece-episode-1",
            provider: "gogoanime",
          }).then((res) => (res?.sources ?? []).length > 0 || false);

          setSourcesAvailabilty((curr: any) => [
            ...curr,
            {
              name: "GoGoAnime",
              value: "gogoanime",
              isAvailable: gogoanimeResponse ? true : false,
            },
          ]);

          break;

        case "aniwatch":
          const isAniwatchAvailable = await getAniwatchEpisodeByEpisodeId({
            episodeId: "one-piece-100?ep=2142",
          }).then((res) => (res?.sources ?? []).length > 0 || false);

          setSourcesAvailabilty((curr: any) => [
            ...curr,
            {
              name: "Aniwatch",
              value: "aniwatch",
              isAvailable: isAniwatchAvailable,
            },
          ]);

          break;

        case "zoro":
          const zoroResponse = await consumetEpisodeByEpisodeId({
            episodeId:
              "bakemonogatari-the-monogatari-series-174$episode$4284$sub",
            provider: "zoro",
          }).then((res) => (res?.sources ?? []).length > 0 || false);

          setSourcesAvailabilty((curr: any) => [
            ...curr,
            {
              name: "Zoro",
              value: "zoro",
              isAvailable: zoroResponse ? true : false,
            },
          ]);

          break;

        default:
          break;
      }
    });
  }

  return (
    <div className={styles.nav_button_container}>
      {buttonOptions.map((button) => (
        <React.Fragment key={button.value}>
          <button
            className={showSourceStatus ? styles.white_color : ""}
            data-active={lastValueReturned == button.value}
            onClick={() => handlePropsFunctionWithBtnValue(button.value)}
            aria-label={button.name}
            title={
              button.value == "crunchyroll"
                ? ""
                : sourcesAvailabilty.find((item) => button.name == item.name)
                      ?.isAvailable
                  ? "Available"
                  : "Not Available"
            }
            disabled={currValue == button.value}
          >
            {showSourceStatus && button.value != "crunchyroll" && (
              <MediaSourceAvailabilityIcon
                isAvailable={
                  sourcesAvailabilty.find((item) => button.name == item.name)
                    ?.isAvailable || false
                }
              />
            )}

            {button.name}
          </button>

          {sepateBtnsWithSpan && (
            <span className={styles.separate_text}> | </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function MediaSourceAvailabilityIcon({
  isAvailable,
}: {
  isAvailable: boolean;
}) {
  if (isAvailable) {
    return (
      <CloudOnlineSvg
        width={18}
        height={18}
        className={styles.source_status}
        data-available={isAvailable}
      />
    );
  }

  return (
    <CloudOfflineSvg
      width={24}
      height={24}
      className={styles.source_status}
      data-available={isAvailable}
    />
  );
}
