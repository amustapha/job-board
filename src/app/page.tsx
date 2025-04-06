import { Hero } from "@/components/Hero";
import { JobsListing } from "@/components/JobsListing";
import { Job } from "@/components/JobView";
import { Suspense } from "react";

async function getJobs(): Promise<Job[]> {
  const res = await fetch("http://localhost:3000/api/jobs", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<JobsListing jobs={[]} isLoading={true} />}>
          <JobsListing jobs={jobs} isLoading={true} />
        </Suspense>
      </main>
    </div>
  );
}
