
import { Hero } from "@/components/Hero";
import { JobsListing } from "@/components/JobsListing";
import { Job } from "@/components/JobView";
import { Suspense } from "react";


async function getJobs(tags?: string[]): Promise<Job[]> {
  const url = new URL("http://localhost:3000/api/jobs");

  if (tags && tags.length > 0) {
    url.searchParams.set("tags", tags.join(","));
  }

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: { tags?: string };
}) {
  const tags = searchParams.tags?.split(",").filter(Boolean);
  const jobs = await getJobs(tags);

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<JobsListing jobs={[]} isLoading={true} />}>
          <JobsListing jobs={jobs} />
        </Suspense>
      </main>
    </div>
  );
}
