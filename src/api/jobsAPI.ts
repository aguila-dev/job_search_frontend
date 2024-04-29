// src/api/jobsAPI.js

import { isJobPostedToday } from '../utils/isJobPostedToday';

const fetchJobs = async (backendUrl: string, today: boolean = false) => {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // sort the jobs by date
    data.jobs.sort((a: any, b: any) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });

    return today
      ? data.jobs.filter((job: any) => isJobPostedToday(job.updated_at))
      : data.jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return error;
  }
};

export default fetchJobs;
