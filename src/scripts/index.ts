import { getJobs } from "./get-jobs";

(async () => {
  const jobs = await getJobs();
  console.log(jobs);
})();
