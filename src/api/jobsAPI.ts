// src/api/jobsAPI.js

const fetchJobs = async (backendUrl: string) => {
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

    return data.jobs; // Assuming the structure is as mentioned
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return []; // Return an empty array in case of error
  }
};

export default fetchJobs;
