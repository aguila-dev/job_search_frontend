import React, { useEffect, useState } from 'react';
import jobBackends from '../constants/jobUrls';
import fetchJobs from '../api/jobsAPI';
import { LoadingSpinner } from '../ui';
import JobPostingSkeleton from '../ui/JobPostingSkeleton';
import SinglePosting from '../components/Cards/SinglePosting';

// interface Job {
//   title: string;
//   name: string;
//   url: string;
//   active?: boolean;
// }

const TodaysJobsPostings = () => {
  const [newJobs, setNewJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const jobsPromises = jobBackends.map(
          (job: JobData) =>
            job.active &&
            job.title &&
            fetchJobs(job.url, true).catch((e) => {
              console.error(`Error fetching jobs from ${job.name}:`, e);
              return []; // Return an empty array in case of an error
            })
        );
        const jobsArrays = await Promise.all(jobsPromises);
        console.log('Jobs arrays:', jobsArrays);

        // Filter out jobs without titles immediately after fetching
        // Filter out non-array items
        const validJobsArrays = jobsArrays.filter(Array.isArray);
        console.log('Valid jobs arrays:', validJobsArrays);
        const allNewJobs = validJobsArrays.flat().map((companyJob) => {
          const appliedJobs = JSON.parse(
            localStorage.getItem('appliedJobs') || '{}'
          );
          return {
            ...companyJob,
            applied: !!appliedJobs[companyJob.name]?.[companyJob.id],
          };
        });

        console.log('All jobs fetched', allNewJobs);
        setNewJobs(allNewJobs);
      } catch (error) {
        console.error('Error fetching all jobs:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  // const filteredJobs = newJobs.filter((job) => {
  //   if (!job?.title) {
  //     console.error('Job missing title:', job);
  //     return false; // Skip this job if title is missing
  //   }
  //   job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  // });

  console.log('todays job postings:\n', newJobs);

  // do any jobs not have a title?
  const jobsWithoutTitles = newJobs.filter((job) => !job?.title);
  console.log('Jobs without titles:', jobsWithoutTitles.length);
  console.log('Jobs without titles:', jobsWithoutTitles);
  return (
    <>
      {isError ? (
        <div>Error loading jobs. Please try again later.</div>
      ) : (
        <>
          <h1>
            Todays Jobs Postings (
            {isLoading ? (
              <LoadingSpinner width='w-5' height='h-5' />
            ) : (
              newJobs.length && newJobs.length
            )}
            )
          </h1>
          <div className='flex flex-col w-full items-center gap-4'>
            <div className='w-full text-center pb-2'>
              <input
                type='text'
                placeholder='Search jobs...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='min-h-8 bg-slate-100 w-full rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
              />
            </div>
          </div>
          <ul className='pt-2 jobs-list-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 flex-grow'>
            {isLoading
              ? // Render skeletons when loading
                Array.from({ length: 10 }, (_, index) => (
                  <li key={index} className='job-posting'>
                    <JobPostingSkeleton />
                  </li>
                ))
              : newJobs.map((job: any, jobIndex: number) => (
                  <li
                    key={jobIndex}
                    className='job-posting flex flex-col justify-between'
                  >
                    <SinglePosting job={job} />
                    <span
                      // onClick={() => handleApplicationToggle(job.id)}
                      className={`hover:cursor-pointer ${
                        job?.applied ? 'applied-button' : 'apply-button'
                      }`}
                    >
                      {job?.applied ? '✔ ' : 'Applied'}
                    </span>
                  </li>
                ))}
          </ul>
        </>
      )}
    </>
  );
};

export default TodaysJobsPostings;
