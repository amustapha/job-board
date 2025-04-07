import dotenv from "dotenv";
import {
  EXCLUDED_KEYWORDS,
  REQUIRED_KEYWORDS,
  TECHNICAL_ROLES,
} from "./constants";
import { getJob, fetchGoogleSearchResults } from "./utils";
import { GoogleJobItem } from "./types";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX; // Custom Search Engine ID

export async function* getJobs() {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.error("Google API configuration is missing");
    return;
  }

  // Iterate through each role category
  for (const [roleTag, roles] of Object.entries(TECHNICAL_ROLES)) {
    try {
      console.log(`Searching for ${roleTag} roles...`);
      const searchQuery = roles.map((role) => `"${role}"`).join(" OR ");

      // Fetch search results using the utility function with pagination
      // This will automatically fetch up to 100 results
      const data = await fetchGoogleSearchResults(
        searchQuery,
        REQUIRED_KEYWORDS,
        EXCLUDED_KEYWORDS,
        1, // Start from the first page
        "w2", // Last 2 weeks
        50 // Maximum 50 results total
      );

      for (const item of data.items) {
        try {
          const job = await getJob(item as GoogleJobItem);
          // Add the role category to the job

          yield {
            ...job,
            tags: [...job.tags, roleTag],
          };
        } catch (error) {
          console.error(`Error processing job:`, error);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${roleTag} jobs:`, error);
    }
  }
}
