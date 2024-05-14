import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import he from 'he';
import { SingleJobPostingSkeletonRow } from '../ui/JobPostingSkeleton';
import getBackendUrl from '../utils/getBackendUrl';
import fetchJobs from '../api/jobsAPI';
import SinglePostingRow from '../components/Table/SinglePostingRow';
import { LoadingSpinner } from '../ui';
import downloadAppliedJobDetails from '../utils/downloadJobDetails';
import SearchAndSort from '../components/SearchAndSort';

// Main component
const GreenhouseCompanyJobsList: React.FC = () => {
  const { company } = useParams<{ company: string }>();
  const [jobs, setJobs] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getJobs = async (company: string) => {
      setIsLoading(true);
      setIsError(false);
      const backendUrl = getBackendUrl(company);
      if (!backendUrl) {
        navigate('/');
        return;
      }
      try {
        const jobsData = await fetchJobs(backendUrl);
        if (!jobsData) {
          throw new Error('Network response errored out');
        }
        const appliedJobs = JSON.parse(
          localStorage.getItem('appliedJobs') || '{}'
        );

        const jobsWithApplicationStatus = jobsData.map((job: any) => ({
          ...job,
          applied: !!appliedJobs[company]?.[job.id],
        }));

        setJobs(jobsWithApplicationStatus);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (company) {
      getJobs(company);
    }
  }, [company, navigate]);

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

  const filteredJobs = jobs.filter((job) =>
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

  const handleApplicationToggle = (jobId: number) => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '{}');
    if (company) {
      if (!appliedJobs[company]) {
        appliedJobs[company] = {};
      }

      if (appliedJobs[company][jobId]) {
        delete appliedJobs[company][jobId];
      } else {
        const jobToSave = jobs.find((job) => job.id === jobId);
        if (jobToSave) {
          appliedJobs[company][jobId] = { ...jobToSave, applied: true };
          const dateApplied = new Date().toLocaleDateString();
          const fileContent = `Job ID: ${jobToSave.id}, Title: ${jobToSave.title}, Company: ${company}, Date Applied: ${dateApplied}\n`;
          downloadAppliedJobDetails(fileContent, `${company}-${jobId}.txt`);
        }
      }

      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));

      const updatedJobs = jobs.map((job) => ({
        ...job,
        applied: !!appliedJobs[company][job.id],
      }));
      setJobs(updatedJobs);
    }
  };

  const fetchJobDetails = async (jobId: number) => {
    if (company) {
      const response = await axios.get(
        `https://boards-api.greenhouse.io/v1/boards/${company}/jobs/${jobId}`
      );
      setSelectedJob(response.data);
    }
  };

  function handleClickOutside(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      setSelectedJob(null);
    }
  }

  return (
    <div className='px-4 w-full'>
      <h2 className='text-center font-semibold text-2xl flex justify-center items-center'>
        Job Listings for {company}{' '}
        <span className='inline-flex justify-center items-center'>
          &#40;
          {jobs?.length ? (
            jobs.length
          ) : !isError ? (
            <LoadingSpinner width='w-6' height='h-6' />
          ) : (
            ''
          )}
          &#41;
        </span>
      </h2>

      {isError ? (
        <div className='flex items-start justify-center pt-4'>
          <div className='text-red-600 bg-white p-4 rounded-lg shadow-lg'>
            Network error, sorry. Please try again later.
          </div>
        </div>
      ) : (
        <SearchAndSort
          setSortOrder={setSortOrder}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
      )}

      <div className='overflow-x-auto jobs-list-container'>
        <table className='min-w-full mt-4 border-collapse text-xs sm:text-base'>
          <thead>
            <tr>
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
                  <SingleJobPostingSkeletonRow key={index} />
                ))
              : sortedAndFilteredJobs.map((job: any, jobIndex: number) => (
                  <SinglePostingRow
                    key={jobIndex}
                    job={job}
                    onRowClick={() => fetchJobDetails(job.id)}
                    onToggleApply={() => handleApplicationToggle(job.id)}
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
    </div>
  );
};

export default GreenhouseCompanyJobsList;
