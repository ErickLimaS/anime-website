import { MediaData } from "@/app/ts/interfaces/anilistMediaData";

export const userMediaStatusEntries: {
  name: string;
  value: MediaData["mediaListEntry"]["status"];
}[] = [
  { name: "Completed", value: "COMPLETED" },
  { name: "Watching", value: "CURRENT" },
  { name: "Planning", value: "PLANNING" },
  { name: "Dropped", value: "DROPPED" },
  { name: "Paused", value: "PAUSED" },
  { name: "Repeating", value: "REPEATING" },
];
