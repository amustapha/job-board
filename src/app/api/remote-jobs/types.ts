
export interface Metatag {
  "og:image"?: string;
  "twitter:image"?: string;
  "og:description"?: string;
  "twitter:description"?: string;
  [key: string]: string | undefined;
}


export interface PageMap {
  cse_thumbnail?: Array<{ src: string }>;
  metatags: Metatag[];
}

export interface GoogleJobItem {
  title: string;
  link: string;
  pagemap: PageMap;
}
