// src/api/jobsAPI.js
import { isJobPostedToday } from '../utils/isJobPostedToday';
// import { wait } from '../utils/wait';

const fetchJobs = async (
  backendUrl: string,
  companyName?: string,
  today: boolean = false
) => {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // await wait(1000);
    const data = await response.json();

    // sort the jobs by date
    data.jobs.sort((a: any, b: any) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });

    const jobsWithCompany = companyName
      ? data.jobs.map((job: any) => ({
          ...job,
          company: companyName,
        }))
      : data.jobs;

    return today
      ? jobsWithCompany.filter((job: any) => isJobPostedToday(job.updated_at))
      : jobsWithCompany;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return error;
    // throw error;
  }
};

export default fetchJobs;
