import Database from "better-sqlite3";
import { Job } from "@/types/job";
import path from "path";
import fs from "fs";

interface DbJob extends Omit<Job, "tags"> {
  id: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

interface LastUpdatedResult {
  lastUpdated: string;
}

// Ensure the db directory exists
const dbDir = path.join(process.cwd(), "src", "db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(path.join(dbDir, "jobs.db"));

// Create jobs table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    companyName TEXT NOT NULL,
    jobTitle TEXT NOT NULL,
    tags TEXT,
    companyLogo TEXT,
    url TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepare statements for better performance
const statements = {
  insert: db.prepare(`
    INSERT INTO jobs (id, companyName, jobTitle, tags, companyLogo, url)
    VALUES (@id, @companyName, @jobTitle, @tags, @companyLogo, @url)
  `),
  getAll: db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC"),
  clear: db.prepare("DELETE FROM jobs"),
  getLastUpdated: db.prepare("SELECT MAX(updatedAt) as lastUpdated FROM jobs"),
  getById: db.prepare("SELECT * FROM jobs WHERE id = ?"),
  deleteById: db.prepare("DELETE FROM jobs WHERE id = ?"),
};

// Helper functions for job operations
export const dbOperations = {
  // Add a new job
  addJob: (job: Job) => {
    // Ensure job has an id

    const jobWithStringTags = {
      ...job,
      tags: JSON.stringify(job.tags),
    };
    return statements.insert.run(jobWithStringTags);
  },

  // Add multiple jobs
  addJobs: (jobs: Job[]) => {
    const insertMany = db.transaction((jobs: Job[]) => {
      for (const job of jobs) {
        // Ensure job has an id

        const jobWithStringTags = {
          ...job,
          tags: JSON.stringify(job.tags),
        };
        statements.insert.run(jobWithStringTags);
      }
    });
    return insertMany(jobs);
  },

  // Get all jobs
  getAllJobs: () => {
    const jobs = statements.getAll.all() as DbJob[];
    return jobs.map((job) => ({
      ...job,
      tags: JSON.parse(job.tags),
    }));
  },

  // Get job by ID
  getJobById: (id: string) => {
    const job = statements.getById.get(id) as DbJob | undefined;
    if (!job) return undefined;

    return {
      ...job,
      tags: JSON.parse(job.tags),
    };
  },

  // Delete job by ID
  deleteJobById: (id: string) => {
    return statements.deleteById.run(id);
  },

  // Clear all jobs
  clearJobs: () => {
    return statements.clear.run();
  },

  // Get last updated timestamp
  getLastUpdated: () => {
    const result = statements.getLastUpdated.get() as LastUpdatedResult;
    return result?.lastUpdated || new Date().toISOString();
  },
};

export default db;
