import { getJobs } from "./get-jobs";


(async () => {
  const jobsGenerator = getJobs();
  for await (const job of jobsGenerator) {
    console.log(job);
  }
})();
