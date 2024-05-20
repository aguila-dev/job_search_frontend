// src/api/jobsAPI.js
import axios from 'axios';
import { isJobPostedToday } from '../utils/isJobPostedToday';
import { wait } from '../utils/wait';

const fetchJobs = async (companySlug: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/v1/api/jobs/company/${companySlug}`
    );

    if (!data) {
      throw new Error('Network response was not ok');
    }
    // await wait(1000);
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return error;
    // throw error;
  }
};

export const fetchTodayJobs = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/v1/api/jobs/todays-jobs`
    );
    if (!data) {
      throw new Error('Network response was not ok');
    }
    return data;
  } catch (error) {
    console.error('Error fetching today jobs:', error);
    return error;
  }
};

export default fetchJobs;
