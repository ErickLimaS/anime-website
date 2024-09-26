export interface MangadexMangaInfo {
  id: string;
  title: string;
  rating: number;
  chapters: MangadexMangaChapters[];
}

export interface MangadexMangaSearchResult {
  id: string;
  title: string;
  lastChapter: string;
  lastVolume: string;
  releaseDate: number;
  headerForImage: {
    Referer: string;
  };
  image: string;
  description: string;
  status: string;
}

export interface MangadexMangaChapters {
  id: string;
  chapterNumber: string;
  volumeNumber: string;
  title: string;
  pages: number;
}

export interface MangadexMangaPages {
  page: number;
  img: string;
}
