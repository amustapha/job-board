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
  for (const roles of TECHNICAL_ROLES) {
    try {
      const searchQuery = roles.map((role) => `"${role}"`).join(" OR ");

      // Fetch search results using the utility function with pagination
      // This will automatically fetch up to 100 results
      const data = await fetchGoogleSearchResults(
        searchQuery,
        REQUIRED_KEYWORDS,
        EXCLUDED_KEYWORDS,
        1, // Start from the first page
        "w2", // Last 2 weeks
        50 // Maximum 100 results total
      );

      for (const item of data.items) {
        try {
          const job = await getJob(item as GoogleJobItem);
          yield job;
        } catch (error) {
          console.error(`Error processing job:`, error);
        }
      }
    } catch (error) {
      console.error("Error fetching remote jobs:", error);
    }
  }
}
