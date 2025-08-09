"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import aniwatch from "@/app/api/aniwatch";
import { EpisodeLinksAnimeWatch } from "@/app/ts/interfaces/aniwatchData";
import gogoanime from "@/app/api/consumet/consumetGoGoAnime";
import { EpisodeLinksGoGoAnime } from "@/app/ts/interfaces/gogoanimeData";
import CloudOfflineSvg from "@/public/assets/cloud-offline.svg";
import CloudOnlineSvg from "@/public/assets/cloud.svg";
import { SourceType } from "@/app/ts/interfaces/episodesSource";

type PropsType = {
  propsFunction: (parameter: string | number) => void;
  buttonOptions: {
    name: string;
    value: number | string | SourceType["source"];
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

  const [gogoanimeAvailble, setGogoanimeAvailble] = useState<boolean | null>();
  const [aniwatchAvailable, setAniwatchAvailable] = useState<boolean | null>();

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

  async function checkVideoSourceAvailability(
    videoSourcesAvailable: PropsType["buttonOptions"]
  ) {
    videoSourcesAvailable.map(async (source) => {
      switch (source.value) {
        case "gogoanime":
          const gogoanimeResponse = (await gogoanime.getEpisodeStreamingLinks({
            episodeId: "one-piece-episode-1",
            useAlternateLinkOption: true,
          })) as EpisodeLinksGoGoAnime;

          setGogoanimeAvailble(gogoanimeResponse != null ? true : false);

          break;

        case "aniwatch":
          const aniwatchResponse = (await aniwatch.getEpisodeLink({
            episodeId: "one-piece-100?ep=2142",
          })) as EpisodeLinksAnimeWatch;

          setAniwatchAvailable(aniwatchResponse != null ? true : false);

          break;

        default:
          break;
      }
    });
  }

  function getBtnTitleByBtnValue(btnValue: SourceType["source"]) {
    switch (btnValue) {
      case "crunchyroll":
        return "";
      case "aniwatch":
        return aniwatchAvailable ? "Online" : "Offline";
      case "gogoanime":
        return gogoanimeAvailble ? "Online" : "Offline";
      default:
        return "";
    }
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
            title={getBtnTitleByBtnValue(button.value as SourceType["source"])}
            disabled={currValue == button.value}
          >
            {showSourceStatus && (
              <MediaSourceAvailabilityIcon
                sourceName={button.value as "aniwatch" | "gogoanime"}
                isAvailable={
                  (button.value as "aniwatch" | "gogoanime") == "aniwatch"
                    ? aniwatchAvailable
                    : gogoanimeAvailble
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
  sourceName,
  isAvailable,
}: {
  sourceName: SourceType["source"];
  isAvailable: boolean | null | undefined;
}) {
  switch (sourceName) {
    case "aniwatch":
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

    case "gogoanime":
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

    default:
      return;
  }
}
