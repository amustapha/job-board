import { PageMap, GoogleJobItem, GoogleSearchResponse } from "./types";
import {
  HTTPS_PREFIX,
  DISCARDED_LINK_SUFFIX,
  TECHNOLOGY_TAGS,
} from "./constants";
import { Job } from "@/types/job";

/**
 * Extracts the slug name from a URL
 * @param link - The job URL
 * @returns The slug name
 */
export function extractSlugName(link: string): string {
  return link.replace(HTTPS_PREFIX, "").split("/")[1];
}

/**
 * Extracts the image link from pagemap data
 * @param pagemap - The pagemap data
 * @returns The image URL
 */
export function extractImageLink(pagemap: PageMap): string {
  return (
    pagemap?.cse_thumbnail?.[0]?.src ||
    pagemap.metatags[0]["og:image"] ||
    pagemap.metatags[0]["twitter:image"] ||
    ""
  );
}

/**
 * Builds a description from title and metatags
 * @param title - The job title
 * @param pagemap - The pagemap data
 * @returns The combined description
 */
export function buildDescription(title: string, pagemap: PageMap): string {
  return (
    title +
    " " +
    (pagemap?.metatags?.[0]?.["og:description"] ||
      pagemap?.metatags?.[0]?.["twitter:description"] ||
      "")
  );
}

/**
 * Extracts technology tags from a description
 * @param description - The job description
 * @returns Array of matching technology tags
 */
export function extractTags(description: string): string[] {
  return TECHNOLOGY_TAGS.filter((tag) =>
    description.toLowerCase().includes(tag.toLowerCase())
  );
}

/**
 * Finds company name by matching parts against slug parts
 * @param parts - Array of title parts
 * @param slugParts - Array of slug parts
 * @returns The matched company name or undefined
 */
export function findCompanyNameFromParts(
  parts: string[],
  slugParts: string[]
): string | undefined {
  return parts.find((part) =>
    slugParts.some((slugPart) =>
      part.toLowerCase().includes(slugPart.toLowerCase())
    )
  );
}

/**
 * Cleans the job title by removing company name and extra characters
 * @param title - The full job title
 * @param companyName - The extracted company name
 * @returns The cleaned job title
 */
export function cleanJobTitle(title: string, companyName: string): string {
  return title
    .replace(companyName, "")
    .trim()
    .replace(/^\s*-\s*/, "")
    .replace(/-$/, "")
    .replace(/\sat$/, "")
    .trim();
}

/**
 * Fixes job application links by removing the /apply suffix
 * @param link - The original job URL
 * @returns The fixed URL
 */
export function fixLink(link: string): string {
  return link.replace(DISCARDED_LINK_SUFFIX, "");
}

/**
 * Extracts company name and job title from the full title
 * @param title - The full job title
 * @param slugName - The slug name from the URL
 * @returns Object containing company name and job title
 */
export function destructureJobTitle(title: string, slugName: string) {
  const hiphenParts = title.split("-");
  const atParts = hiphenParts[0].split("at");
  const slugParts = slugName.split("-");
  let companyName: string | undefined = undefined;

  // Try to find company name from hyphenated parts
  if (hiphenParts.length > 1) {
    companyName = findCompanyNameFromParts(hiphenParts, slugParts);
  }

  // If not found, try to find from "at" parts
  if (!companyName && atParts.length > 1) {
    companyName = findCompanyNameFromParts(atParts, slugParts);
  }

  // Fallback to slug name if no match found
  if (!companyName) {
    companyName = slugName;
  }

  companyName = companyName.trim();

  const jobTitle = cleanJobTitle(title, companyName);

  return { companyName, jobTitle };
}

/**
 * Retrieves and processes a job from the Google response
 *
 * in future, this function will also crawl the job posting website to get the full job description
 *
 * @param jobItem - The job item from the Google response
 * @returns Processed job data
 */
export async function getJob(jobItem: GoogleJobItem): Promise<Job> {
  const { title, link, pagemap } = jobItem;
  const slugName = extractSlugName(link);

  const imageLink = extractImageLink(pagemap);
  const description = buildDescription(title, pagemap);
  const tags = extractTags(description);

  const { companyName, jobTitle } = destructureJobTitle(title, slugName);

  return {
    companyName,
    jobTitle,
    tags,
    companyLogo: imageLink,
    url: fixLink(link),
  };
}

/**
 * Fetches job search results from Google Custom Search API with pagination
 * @param searchQuery - Main search query
 * @param exactTerms - Required keywords for the search
 * @param excludedTerms - Terms to exclude from search
 * @param start - Starting index for pagination
 * @param dateRestrict - Time restriction for results (e.g., 'd7' for last week)
 * @param maxResults - Maximum total results to fetch (default: 100)
 * @returns The search results from Google API
 */
export async function fetchGoogleSearchResults(
  searchQuery: string,
  exactTerms: string[] = [],
  excludedTerms: string[] = [],
  start: number = 1,
  dateRestrict: string = "w2",
  maxResults: number = 100
): Promise<GoogleSearchResponse> {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_CX = process.env.GOOGLE_CX;
  const numResults = 10; // Fixed number of results per page

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    throw new Error("Google API configuration is missing");
  }

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.append("key", GOOGLE_API_KEY);
  url.searchParams.append("cx", GOOGLE_CX);

  // Only append exactTerms if the array is not empty
  if (exactTerms.length > 0) {
    const formattedExactTerms = exactTerms
      .map((term) => `"${term}"`)
      .join(" OR ");
    url.searchParams.append("exactTerms", formattedExactTerms);
  }

  // Only append excludedTerms if the array is not empty
  if (excludedTerms.length > 0) {
    const formattedExcludedTerms = excludedTerms
      .map((term) => `"${term}"`)
      .join(" OR ");
    url.searchParams.append("excludeTerms", formattedExcludedTerms);
  }

  url.searchParams.append("q", searchQuery);
  url.searchParams.append("sort", "date");
  url.searchParams.append("dateRestrict", dateRestrict);
  url.searchParams.append("lr", "lang_en");
  url.searchParams.append("num", numResults.toString());
  url.searchParams.append("start", start.toString());

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    // Handle error response from Google API
    const errorData = data as { error?: { message?: string } };
    throw new Error(
      errorData.error?.message || "Failed to fetch search results"
    );
  }

  const searchData = data as GoogleSearchResponse;

  // Check if there are more results and we haven't reached the max limit
  const currentResults = searchData.items || [];
  const totalResults = Math.min(
    parseInt(searchData.searchInformation?.totalResults || "0"),
    maxResults
  );

  // Check if there's a next page and we haven't reached the max limit
  const hasNextPage =
    searchData.queries?.nextPage && searchData.queries.nextPage.length > 0;
  const nextStartIndex =
    hasNextPage && searchData.queries.nextPage
      ? searchData.queries.nextPage[0].startIndex
      : null;

  // If there's a next page and we haven't reached the max limit, fetch the next page
  if (
    hasNextPage &&
    nextStartIndex &&
    nextStartIndex <= totalResults &&
    currentResults.length > 0
  ) {
    const nextPageData = await fetchGoogleSearchResults(
      searchQuery,
      exactTerms,
      excludedTerms,
      nextStartIndex,
      dateRestrict,
      maxResults
    );

    // Combine the results
    return {
      ...searchData,
      items: [...currentResults, ...(nextPageData.items || [])],
    };
  }

  return searchData;
}
