import { Job } from "@/components/JobView";

export const mockJobs: Job[] = [
  {
    companyLogo: "/company-logos/amazon.svg",
    companyName: "Tech Corp",
    jobTitle: "Senior Frontend Developer",
    tags: ["React", "TypeScript", "Next.js"],
    location: "Remote",
    jobType: "Full-time",
    salary: "$120,000 - $150,000",
    url: "https://techcorp.com/jobs/senior-frontend",
  },
  {
    companyLogo: "/company-logos/startupx.svg",
    companyName: "StartupX",
    jobTitle: "Backend Engineer",
    tags: ["Node.js", "MongoDB", "AWS"],
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$130,000 - $160,000",
    url: "https://startupx.com/jobs/backend",
  },
  {
    companyLogo: "/company-logos/innovation-labs.svg",
    companyName: "Innovation Labs",
    jobTitle: "Full Stack Developer",
    tags: ["React", "Node.js", "PostgreSQL"],
    location: "New York, NY",
    jobType: "Contract",
    salary: "$100,000 - $130,000",
    url: "https://innovationlabs.com/jobs/fullstack",
  },
];
