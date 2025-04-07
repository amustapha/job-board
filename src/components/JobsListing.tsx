import { JobView } from "@/components/JobView";
import { Job } from "@/types/job";

interface JobsListingProps {
  jobs: Job[];
  isLoading?: boolean;
}

export function JobsListing({ jobs, isLoading = false }: JobsListingProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border shadow-sm hover:cursor-progress"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 animate-pulse bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 rounded w-16 animate-pulse"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
              </div>
            </div>
            <div className="flex">
              <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobView
          key={index}
          id={job.id}
          companyLogo={job.companyLogo}
          companyName={job.companyName}
          jobTitle={job.jobTitle}
          tags={job.tags}
          location={job.location}
          jobType={job.jobType}
          salary={job.salary}
          url={job.url}
        />
      ))}
    </div>
  );
}
