export interface News {
  title: string;
  id: string;
  uploadedAt: string;
  topics: string[];
  preview: {
    intro: string;
    full: string;
  };
  thumbnail: string;
  thumbnailHash: string;
  url: string;
}

export interface NewsArcticle extends News {
  intro: string;
  description: string;
}
