// src/components/WorkdayCompanyComponent.tsx

import React, { useState, useEffect } from 'react';
import fetchWorkdayAPI from '../api/fetchWorkdayAPI'; // Adjust the import path as necessary
import WorkdayPosting from '../components/Cards/WorkdayPosting';
import sortJobsByPostedDate from '../utils/sortingFunction';
import fetchWorkdayLocations from '../api/fetchWorkdayLocations';
import { useNavigate, useParams } from 'react-router-dom';
import { workdayJobs } from '../constants/jobUrls';
import { useAppliedJobs } from '../hooks/useAppliedJobs';
import { extractWorkdayJobId } from '../utils/extractJobIds';
import { LoadingSpinner } from '../ui';
import JobPostingSkeleton from '../ui/JobPostingSkeleton';
import LocationDropdown from '../components/Dropdown/LocationDropdown';

const WorkdayCompanyJobsList: React.FC = () => {
  const [jobs, setJobs] = useState<any>({});
  const [offset, setOffset] = useState<number>(0);
  const [totalJobCount, setTotalJobCount] = useState<number>(0);
  console.log('totalJobCount', totalJobCount);
  const [searchText, setSearchText] = useState<string>('');
  const [tempSearchText, setTempSearchText] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [dropdownLocations, setDropdownLocations] = useState<any[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { company } = useParams<{ company: string }>();
  const currentCompany = workdayJobs.find((comp) => comp.name === company);
  const [appliedJobs, toggleJobApplication] = useAppliedJobs(
    company as string,
    extractWorkdayJobId
  );

  useEffect(() => {
    if (loading) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [loading]);

  useEffect(() => {
    const getWorkdayJobs = async (company: string) => {
      setLoading(true);
      try {
        const data = await fetchWorkdayAPI(
          company as string,
          20,
          offset,
          searchText,
          selectedLocations
        );

        if (!data) {
          navigate('/');
          return;
        }

        if (offset === 0) setTotalJobCount(data.total);

        if (data.jobPostings) {
          // Sort the job postings based on the 'sortOrder' state
          const sortedJobPostings = [...data.jobPostings].sort((a, b) =>
            sortJobsByPostedDate(a, b, sortOrder)
          );
          setJobs({
            ...data,
            jobPostings: sortedJobPostings,
          });
        } else {
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    const getWorkdayLocations = async (company: string) => {
      try {
        const locations = await fetchWorkdayLocations(company);
        // console.log('locations', locations);
        setDropdownLocations(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (company) {
      getWorkdayJobs(company);
      getWorkdayLocations(company);
    }
  }, [company, offset, searchText, sortOrder, navigate, selectedLocations]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchText(tempSearchText);
    setOffset(0);
  };

  const handleLocationChange = (locationId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedLocations((prev) => [...prev, locationId]);
    } else {
      setSelectedLocations((prev) => prev.filter((id) => id !== locationId));
    }
  };

  return (
    <div className='px-4 w-full scrollbar-hide'>
      <h2 className='text-center font-semibold text-2xl'>
        Job listings for {currentCompany?.title} (
        {totalJobCount ? (
          totalJobCount
        ) : (
          <LoadingSpinner width='w-6' height='h-6' />
        )}
        )
      </h2>
      <div className='flex items-center justify-center'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 items-center justify-center'>
          <LocationDropdown
            locations={dropdownLocations}
            selectedLocations={selectedLocations}
            onLocationChange={handleLocationChange}
          />

          <button
            type='button'
            className='w-40 text-center'
            onClick={() => setSortOrder('newest')}
          >
            Sort by Newest
          </button>
          <button
            type='button'
            className='w-40 text-center'
            onClick={() => setSortOrder('oldest')}
          >
            Sort by Oldest
          </button>
          <button
            type='button'
            className='w-40 text-center'
            onClick={() => setSortOrder('')}
          >
            Reset Sort
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSearchSubmit}
        className='w-full max-w-[673px] flex items-center justify-center shadow-md shadow-zinc-500 py-2 rounded-xl mb-2'
      >
        <input
          type='text'
          value={tempSearchText}
          onChange={(e) => setTempSearchText(e.target.value)}
          placeholder='Search jobs...'
          className='search-input flex-1'
        />
        <button
          type='submit'
          onClick={() => {
            setSearchText(tempSearchText);
            setOffset(0);
          }}
        >
          Search
        </button>
      </form>
      <ul className='pt-2 jobs-list-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2'>
        {loading
          ? Array.from({ length: 10 }, (_, index) => (
              <li key={index} className='job-posting'>
                <JobPostingSkeleton />
              </li>
            ))
          : jobs?.jobPostings?.map((job: any, jobIndex: number) => (
              <li
                key={jobIndex}
                className='job-posting flex flex-col justify-between'
              >
                <WorkdayPosting
                  job={job}
                  baseUrl={currentCompany?.url}
                  appliedJobs={appliedJobs}
                  extractJobId={extractWorkdayJobId}
                />
                <span
                  onClick={() => toggleJobApplication(job)}
                  className={`hover:cursor-pointer hover:bg-slate-200 rounded-xl p-2 ${
                    appliedJobs[job.id] ? 'applied-button' : 'apply-button'
                  }`}
                >
                  {appliedJobs[job.id] ? '✔' : 'Apply'}
                </span>
              </li>
            ))}
      </ul>
      <section className='py-2 flex w-full justify-center md:gap-4 items-center shadow-lg'>
        <button
          type='button'
          onClick={() => setOffset(offset - 20)}
          className={`${offset === 0 ? 'hidden' : 'cursor-pointer'}`}
          disabled={offset === 0}
        >
          Previous
        </button>
        <button type='button' onClick={() => setOffset(offset + 20)}>
          Next
        </button>
      </section>
    </div>
  );
};

export default WorkdayCompanyJobsList;
