interface JobData {
  title: string;
  name: string;
  url: string;
  active?: boolean;
  logo?: any;
}
interface CompanyNameCardProps {
  company: JobData;
  onClick: () => void;
}
interface AppliedJobs {
  [key: string]: JobData;
}

interface Job {
  company: string;
  title: string;
  location: { name?: string };
  locationsText?: string;
  updated_at?: any;
  absolute_url?: string;
  externalPath?: string;
  considering?: boolean;
  appliedDate?: any;
  id: any;
  status?: string;
}
interface JobRowProps {
  job: Job;
  handleAppliedDateChange: (
    company: string,
    jobId: number,
    newDate: string
  ) => void;
  handleStatusChange: (company: string, jobId: number, status: string) => void;
  handleJobConsideration: (
    company: string,
    jobId: number,
    considering: boolean
  ) => void;
}
// Define Props for the JobTable Component
interface JobTableProps {
  jobs: Job[];
  handleAppliedDateChange: (
    company: string,
    jobId: number,
    newDate: string
  ) => void;
  handleStatusChange: (company: string, jobId: number, status: string) => void;
  handleJobConsideration: (
    company: string,
    jobId: number,
    considering: boolean
  ) => void;
  handleAppliedDateSort: () => void;
  appliedDateSortOrder: 'asc' | 'desc';
}
