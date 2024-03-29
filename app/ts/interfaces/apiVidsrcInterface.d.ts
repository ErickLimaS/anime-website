export interface VidsrcEpisodeLink {

    source: string,
    subtitles: {
        file: string,
        label: string,
        kind: string,
        default?: boolean 
    }[]

}