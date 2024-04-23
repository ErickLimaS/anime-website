export interface MangaInfo {

    id: string,
    title: string,
    rating: number,
    chapters: MangaChapters[]

}
export interface MangaSearchResult {

    id: string,
    title: string,
    lastChapter: string,
    lastVolume: string,
    releaseDate: number,
    headerForImage: {
        Referer: string,
    },
    image: string,
    description: string,
    status: string,

}
export interface MangaChapters {

    id: string,
    chapterNumber: string,
    volumeNumber: string,
    title: string,
    pages: number,

}

export interface MangaPages {

    page: number,
    img: string

}