import { useEffect, useState } from 'react';
import jobBackends from '../constants/jobUrls';
import fetchJobs from '../api/jobsAPI';
import { LoadingSpinner } from '../ui';
import { SingleJobPostingSkeletonRow } from '../ui/JobPostingSkeleton';
import SinglePostingRow from '../components/Table/SinglePostingRow';
import he from 'he';
import axios from 'axios';
import downloadAppliedJobDetails from '../utils/downloadJobDetails';
import SearchAndSort from '../components/SearchAndSort';

const TodaysJobsPostings = () => {
  const [newJobs, setNewJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const jobsPromises = jobBackends.map(
          (job: JobData) =>
            job.active &&
            job.title &&
            fetchJobs(job.url, job.name, true).catch((e) => {
              console.error(`Error fetching jobs from ${job.name}:`, e);
              return []; // Return an empty array in case of an error
            })
        );
        const jobsArrays = await Promise.all(jobsPromises);

        const appliedJobs = JSON.parse(
          localStorage.getItem('appliedJobs') || '{}'
        );

        // Filter out jobs without titles immediately after fetching
        // Filter out non-array items
        const validJobsArrays = jobsArrays.filter(Array.isArray);

        const allNewJobs = validJobsArrays.flat().map((companyJob) => {
          const appliedJobs = JSON.parse(
            localStorage.getItem('appliedJobs') || '{}'
          );
          return {
            ...companyJob,
            applied: !!appliedJobs[companyJob.name]?.[companyJob.id],
          };
        });

        const jobsWithApplicationStatus = allNewJobs.map((job: any) => ({
          ...job,
          applied: !!appliedJobs[job?.company]?.[job.id],
        }));

        setNewJobs(jobsWithApplicationStatus);
      } catch (error) {
        console.error('Error fetching all jobs:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedJob]);

  const fetchJobDetails = async (job: any) => {
    if (job.company) {
      const response = await axios.get(
        `https://boards-api.greenhouse.io/v1/boards/${job.company}/jobs/${job.id}`
      );
      setSelectedJob(response.data);
    }
  };

  const filteredJobs = newJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredJobs = filteredJobs.sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();

    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else if (sortOrder === 'oldest') {
      return dateA - dateB;
    }
    return 0;
  });

  function handleClickOutside(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      setSelectedJob(null);
    }
  }
  const handleApplicationToggle = (job: any) => {
    const company = job.company;
    const jobId = job.id;
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '{}');
    if (company) {
      if (!appliedJobs[company]) {
        appliedJobs[company] = {};
      }

      if (appliedJobs[company][jobId]) {
        delete appliedJobs[company][jobId];
      } else {
        const jobToSave = newJobs.find((job) => job.id === jobId);
        if (jobToSave) {
          const dateApplied = new Date().toISOString().split('T')[0];
          appliedJobs[company][jobId] = {
            ...jobToSave,
            applied: true,
            appliedDate: dateApplied,
            status: 'active',
            considering: true,
          };
          const fileContent = `Job ID: ${jobToSave.id}, Title: ${jobToSave.title}, Company: ${company}, Date Applied: ${dateApplied}\n`;
          downloadAppliedJobDetails(fileContent, `${company}-${jobId}.txt`);
        }
      }
      console.log('Applied jobs:', appliedJobs);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));

      const updatedJobs = newJobs.map((job) => ({
        ...job,
        applied: !!appliedJobs[company][job.id],
        appliedDate: appliedJobs[company][job.id]?.appliedDate,
        status: appliedJobs[company][job.id]?.status,
        considering: appliedJobs[company][job.id]?.considering,
      }));
      setNewJobs(updatedJobs);
    }
  };
  return (
    <>
      {isError ? (
        <div>Error loading jobs. Please try again later.</div>
      ) : (
        <>
          <h1 className='text-lg text-center font-bold'>
            Todays Jobs Postings (
            {isLoading ? (
              <LoadingSpinner width='w-5' height='h-5' />
            ) : (
              newJobs.length && newJobs.length
            )}
            )
          </h1>
          <SearchAndSort
            setSortOrder={setSortOrder}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
          <div className='overflow-x-auto jobs-list-container'>
            <table className='min-w-full mt-4 border-collapse text-xs sm:text-base'>
              <thead>
                <tr className='bg-[#f4f4f4]'>
                  <th className='border p-2'>Company</th>
                  <th className='border p-2'>Title</th>
                  <th className='border p-2'>Last Updated</th>
                  <th className='border p-2'>Location</th>
                  <th className='border p-2'>Job Link</th>
                  <th className='border p-2'>Applied</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }, (_, index) => (
                      <SingleJobPostingSkeletonRow key={index} cols={6} />
                    ))
                  : sortedAndFilteredJobs.map((job: any, jobIndex: number) => (
                      <SinglePostingRow
                        key={jobIndex}
                        job={job}
                        onRowClick={() => fetchJobDetails(job)}
                        onToggleApply={() => handleApplicationToggle(job)}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          {selectedJob && (
            <div className='fixed inset-0 z-50 flex justify-end'>
              <div className='overlay fixed inset-0 bg-black opacity-50'></div>
              <div className='relative w-full md:w-2/3 h-full bg-white shadow-lg p-4 overflow-y-auto'>
                <button
                  type='button'
                  onClick={() => setSelectedJob(null)}
                  className='fixed top-2 right-4 p-2 w-12 h-12 bg-red-500 text-white rounded-full opacity-50 hover:opacity-90'
                  aria-label='Close'
                >
                  &times;
                </button>
                <div
                  className='job-details-content prose'
                  dangerouslySetInnerHTML={{
                    __html: he.decode(selectedJob.content),
                  }}
                ></div>
                <button
                  type='button'
                  onClick={() => setSelectedJob(null)}
                  className='mt-4 p-2 bg-red-500 text-white rounded-lg'
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TodaysJobsPostings;
