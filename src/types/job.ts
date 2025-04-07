export interface Job {
  id: string;
  companyLogo: string;
  companyName: string;
  jobTitle: string;
  tags: string[];
  location?: string;
  jobType?: string;
  salary?: string;
  url: string;
}
