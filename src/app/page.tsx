import { Hero } from "@/components/Hero";
import { JobsListing } from "@/components/JobsListing";
import { Job } from "@/types/job";
import Link from "next/link";
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const tags =
    typeof resolvedParams.tags === "string"
      ? resolvedParams.tags.split(",").filter(Boolean)
      : [];
  const jobs = await getJobs(tags);

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        {tags && tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-text-primary-light dark:text-text-primary-dark">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Showing results for: {tags.join(", ")}
            </p>
          </div>
        )}

        {jobs && jobs.length === 0 && (
          <Link
            href="/"
            className="inline-block mt-2 px-4 py-2 text-sm rounded-md transition-colors"
            style={{
              backgroundColor: "var(--button-secondary-bg, #f0f0f0)",
              color: "var(--button-secondary-text, #333)",
            }}
          >
            Clear all filters
          </Link>
        )}
        <Suspense fallback={<JobsListing jobs={[]} isLoading={true} />}>
          <JobsListing jobs={jobs} />
        </Suspense>
      </main>
    </div>
  );
}
