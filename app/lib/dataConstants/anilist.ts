import { ApiDefaultResult } from "@/app/ts/interfaces/apiAnilistDataInterface";

export const userMediaStatusEntries: { name: string, value: ApiDefaultResult["mediaListEntry"]["status"] }[] = [
    { name: "Completed", value: "COMPLETED" },
    { name: "Watching", value: "CURRENT" },
    { name: "Planning", value: "PLANNING" },
    { name: "Dropped", value: "DROPPED" },
    { name: "Paused", value: "PAUSED" },
    { name: "Repeating", value: "REPEATING" },
]