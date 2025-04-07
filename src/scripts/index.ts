import { getJobs } from "./get-jobs";
import { dbOperations } from "../db";

(async () => {
  try {
    console.log("Starting job scraping process...");

    // Clear existing jobs if needed
    // dbOperations.clearJobs();

    const jobsGenerator = getJobs();
    let jobCount = 0;

    for await (const job of jobsGenerator) {
      try {
        // Save job to database
        dbOperations.addJob(job);
        jobCount++;

        console.log(`Processed ${jobCount} jobs so far...`);
      } catch (error) {
        console.error(
          `Error saving job: ${job.companyName} - ${job.jobTitle}`,
          error
        );
      }
    }

    console.log(`Job scraping completed. Total jobs saved: ${jobCount}`);
    console.log(`Last updated: ${dbOperations.getLastUpdated()}`);
  } catch (error) {
    console.error("Error in job scraping process:", error);
  }
})();
