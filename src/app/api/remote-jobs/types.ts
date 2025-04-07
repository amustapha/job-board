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

export interface GoogleSearchInformation {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
}

export interface GoogleSearchQueries {
  request: Array<{
    title: string;
    totalResults: string;
    searchTerms: string;
    count: number;
    startIndex: number;
    inputEncoding: string;
    outputEncoding: string;
    safe: string;
    cx: string;
    sort: string;
    excludeTerms?: string;
    dateRestrict: string;
  }>;
  nextPage?: Array<{
    title: string;
    totalResults: string;
    searchTerms: string;
    count: number;
    startIndex: number;
    inputEncoding: string;
    outputEncoding: string;
    safe: string;
    cx: string;
    sort: string;
    excludeTerms?: string;
    dateRestrict: string;
  }>;
}

export interface GoogleSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: GoogleSearchQueries;
  context: {
    title: string;
  };
  searchInformation: GoogleSearchInformation;
  items: GoogleJobItem[];
}
