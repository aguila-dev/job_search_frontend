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
import JobPostingSkeleton from '../ui/JobPostingSkeleton';
import LocationDropdown from '../components/Dropdown/LocationDropdown';

const WorkdayCompanyJobsList: React.FC = () => {
  const [jobs, setJobs] = useState<any>({});
  const [offset, setOffset] = useState<number>(0);
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

  // console.log('appliedJobs', appliedJobs);

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
        // console.log('data', data);
        if (!data) {
          navigate('/');
          return;
        }
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
    <div className='px-4 w-full'>
      <h1>{currentCompany?.title.toUpperCase()}</h1>
      <div>
        <div className='flex gap-2'>
          <LocationDropdown
            locations={dropdownLocations}
            selectedLocations={selectedLocations}
            onLocationChange={handleLocationChange}
          />
          <button type='button' onClick={() => setSortOrder('newest')}>
            Sort by Newest
          </button>
          <button type='button' onClick={() => setSortOrder('oldest')}>
            Sort by Oldest
          </button>
          <button type='button' onClick={() => setSortOrder('')}>
            Reset Sort
          </button>
        </div>
      </div>
      <form onSubmit={handleSearchSubmit} className='w-full flex'>
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
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2'>
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
      <button
        type='button'
        onClick={() => setOffset(offset - 20)}
        disabled={offset === 0}
      >
        Previous
      </button>
      <button type='button' onClick={() => setOffset(offset + 20)}>
        Next
      </button>
    </div>
  );
};

export default WorkdayCompanyJobsList;
